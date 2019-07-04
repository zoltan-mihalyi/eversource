import { EventBus } from '../../../common/es/EventBus';
import { ServerEvents } from './ServerEvents';
import { InteractionTable, QuestId, QuestInfo } from '../../../common/domain/InteractionTable';
import { Quests, ServerComponents } from './ServerComponents';
import { Quest } from '../quest/Quest';
import { QuestProgression } from '../quest/QuestLog';
import { EntityContainer } from '../../../common/es/EntityContainer';
import { Entity } from '../../../common/es/Entity';
import { distanceY, Position } from '../../../common/domain/Location';
import { CreatureAttitude } from '../../../common/components/CommonComponents';
import { QuestIndexer } from '../quest/QuestIndexer';
import { CharacterInventory } from '../character/CharacterInventory';
import { DataContainer } from '../data/DataContainer';
import { ItemInfoWithCount } from '../../../common/protocol/ItemInfo';
import { trySendAction } from '../utils';

export function interactionSystem(entityContainer: EntityContainer<ServerComponents>, eventBus: EventBus<ServerEvents>,
                                  { questIndexer }: DataContainer) {

    const interactingEntities = entityContainer.createQuery('interacting');
    const listeningEntities = entityContainer.createQuery('listening');

    eventBus.on('update', () => {
        const stillListening = new Set<Entity<ServerComponents>>();

        interactingEntities.forEach((components, entity) => {
            const { interacting } = components;

            if (!inInteractionRadius(components, interacting.entity.components)) {
                entity.unset('interacting');
            } else {
                stillListening.add(interacting.entity)
            }
        });

        listeningEntities.forEach((components, entity) => {
            if (!stillListening.has(entity)) {
                entity.unset('listening');
            }
        })
    });

    eventBus.on('tryInteract', ({ source, target }) => {
        const { attitude } = target.components;

        if (attitude && attitude.value !== CreatureAttitude.FRIENDLY) {
            source.set('target', {
                entityId: target.id,
            });
            eventBus.emit('hit', {
                source,
                target,
            });
            return;
        }

        const { useSpell, loot } = target.components;

        if (useSpell) {
            eventBus.emit('trySpellCast', { caster: source, target, spell: useSpell });
            return;
        }
        if (loot) {
            eventBus.emit('loot', { entity: source, looted: target, loot });
            return;
        }

        const interactionTable = getInteractionTable(source, target, questIndexer);
        if (!interactionTable) {
            return;
        }

        if (!inInteractionRadius(source.components, target.components)) {
            trySendAction(source, {
                type: 'failed',
                actionType: 'too-far-away',
            });
            return;
        }

        source.set('interacting', {
            entity: target,
        });
        target.set('listening', true);
    });

    eventBus.on('tryAcceptQuest', ({ entity, questId }) => {
        const questContext = findQuest(entity, questId, 'acceptable');
        if (!questContext) {
            return;
        }

        eventBus.emit('acceptQuest', {
            entity,
            quests: questContext.quests,
            questId,
        });
    });

    eventBus.on('tryCompleteQuest', ({ entity, questId, selectedItems }) => {
        const questContext = findQuest(entity, questId, 'completable');
        if (!questContext) {
            return;
        }

        const rewards = questContext.quest.rewards;
        if (selectedItems.length !== rewards.length) {
            return;
        }

        const selectedInventoryItems: ItemInfoWithCount[] = [];
        for (let i = 0; i < selectedItems.length; i++) {
            const itemIndex = selectedItems[i];
            const questRewardInfo = rewards[i].options[itemIndex];
            if (!questRewardInfo) {
                trySendAction(entity, {
                    type: 'failed',
                    actionType: 'no-reward-selected',
                });
                return;
            }
            selectedInventoryItems.push(questRewardInfo);
        }

        eventBus.emit('completeQuest', {
            entity,
            selectedItems: selectedInventoryItems,
            quests: questContext.quests,
            quest: questContext.quest,
        });
    });

    function findQuest(entity: Entity<ServerComponents>, questId: QuestId, type: 'acceptable' | 'completable'): QuestContext | undefined {
        const { interacting, quests } = entity.components;
        if (!interacting || !quests) {
            return;
        }

        const interactionTable = getInteractionTable(entity, interacting.entity, questIndexer);
        if (!interactionTable) {
            return;
        }
        const quest = interactionTable[type].find(q => q.id === questId);
        if (!quest) {
            return;
        }
        return { quest, quests };
    }
}

interface QuestContext {
    quest: QuestInfo;
    quests: Quests;
}

export function getInteractionTable(source: Entity<ServerComponents>, target: Entity<ServerComponents>,
                                    questIndexer: QuestIndexer): InteractionTable | null {

    const { quests, inventory } = source.components;
    if (!quests || !inventory) {
        return null;
    }

    const { name, interactable } = target.components;
    if (!interactable || !name) {
        return null;
    }

    const acceptable: QuestInfo[] = [];
    const completable: QuestInfo[] = [];
    const completableLater: QuestInfo[] = [];

    const { questsDone, questLog } = quests;
    for (const quest of interactable.quests) {
        const isNewQuest = !questsDone.has(quest.id) && !questLog.has(quest.id);
        if (isNewQuest && preconditionMet(questsDone, quest)) {
            acceptable.push(questIndexer.questInfoMap.get(quest.id)!);
        }
    }

    for (const quest of interactable.questCompletions) {
        const questStatus = questLog.get(quest.id);
        if (questStatus === void 0) {
            continue;
        }
        const questInfo = questIndexer.questInfoMap.get(quest.id)!;
        const requirementsProgression = questRequirementsProgression(quest, inventory);
        if (questStatus !== 'failed' && allTaskComplete(quest, questStatus, requirementsProgression)) {
            completable.push(questInfo);
        } else {
            completableLater.push(questInfo);
        }
    }

    return {
        name: name.value,
        story: interactable.story,
        entityId: target.id,
        acceptable,
        completable,
        completableLater,
    };
}

export function questRequirementsProgression(quest: Quest, inventory: CharacterInventory): number[] {
    const { tasks } = quest;
    if (!tasks) {
        return [];
    }
    return tasks.requirements.map((req) => {
        return Math.min(req.count, inventory.getCount(req.itemId));
    });
}

function preconditionMet(done: Set<QuestId>, quest: Quest) {
    for (const requirement of quest.requires) {
        if (!done.has(requirement)) {
            return false;
        }
    }
    return true;
}

function allTaskComplete(quest: Quest, progression: QuestProgression, requirementsProgression: number[]): boolean {
    const tasks = quest.tasks;
    if (!tasks) {
        return true;
    }

    for (let i = 0; i < tasks.list.length; i++) {
        if (progression[i] !== tasks.list[i].count) {
            return false;
        }
    }
    for (let i = 0; i < tasks.requirements.length; i++) {
        if (requirementsProgression[i] !== tasks.requirements[i].count) {
            return false;
        }
    }
    return true;
}

function inInteractionRadius(actor: Partial<ServerComponents>, target: Partial<ServerComponents>) {
    if (!actor.position || !target.position) {
        return false;
    }

    return distance(actor.position, target.position) < 4;
}

function distance(p1: Position, p2: Position): number {
    const dx = p1.x - p2.x;
    const dy = distanceY(p1.y, p2.y);
    return Math.sqrt(dx * dx + dy * dy);
}
