import { ServerEvents } from './ServerEvents';
import { EventBus } from '../../../common/es/EventBus';
import { Task } from '../quest/Quest';
import { QuestId } from '../../../common/domain/InteractionTable';
import { QuestProgression } from '../character/CharacterDetails';
import { QuestLog, Quests } from './ServerComponents';
import { InventoryItem } from '../Item';
import { DataContainer } from '../data/DataContainer';
import { Spell } from '../Spell';
import { ItemInfoWithCount } from '../../../common/protocol/ItemInfo';

type QuestUpdate = 'none' | 'increase' | { setValue: number };

export function questSystem(eventBus: EventBus<ServerEvents>, { questIndexer }: DataContainer) {

    eventBus.on('kill', ({ killer, killed }) => {
        const killerQuests = killer.components.quests;
        const npcId = killed.components.npcId;

        if (!killerQuests || !npcId) {
            return;
        }

        updateQuestLog(killerQuests, task => increase(task.type === 'kill' && task.npcIds.indexOf(npcId) !== -1));
    });

    eventBus.on('area', ({ visitor, name }) => {
        const { quests } = visitor.components;
        if (!quests) {
            return;
        }

        updateQuestLog(quests, task => increase(task.type === 'visit' && task.areaName === name));
    });

    eventBus.on('spellCast', ({ caster, target, spell }) => {
        const { quests } = caster.components;
        if (!quests) {
            return;
        }

        updateQuestLog(quests, task => {
            return increase(spellMatchesTask(task, spell));
        });
    });

    eventBus.on('acceptQuest', ({ entity, quests, questId }) => {
        const quest = questIndexer.quests.get(questId)!;
        const tasks = quest.tasks;
        const progression = tasks ? tasks.list.map(() => 0) : [];
        quests.questLog.set(questId, progression);
        const { inventory } = entity.components;
        if (inventory && quest.provides) {
            //TODO check inventory size
            entity.set('inventory', inventory.add(quest.provides));
        }
    });

    eventBus.on('completeQuest', ({ entity, quests, quest, selectedItems }) => {
        const questId = quest.id;

        const requiredItems = quest.requirements.map(inventoryItem);
        let inventory = entity.components.inventory!.remove(requiredItems);

        inventory = inventory.add(selectedItems.map(inventoryItem));
        //TODO check inventory size

        entity.set('inventory', inventory);

        quests.questLog.delete(questId);
        quests.questsDone.add(questId);
    });


    eventBus.on('tryAbandonQuest', ({ entity, questId }) => {
        const { quests } = entity.components;
        if (!quests) {
            return;
        }

        if (!quests.questLog.has(questId)) {
            return;
        }

        quests.questLog.delete(questId);
        const { inventory } = entity.components;
        if (inventory) {
            entity.set('inventory', inventory.removeIf(item => item.questId === questId));
        }
    });

    function updateQuestLog(quests: Quests, update: (task: Task) => QuestUpdate) {
        const { questLog } = quests;

        questLog.forEach((q, questId) => {
            if (q === 'failed') {
                return;
            }
            const tasks = questIndexer.quests.get(questId)!.tasks;
            if (!tasks) {
                return;
            }

            tasks.list.forEach((task, i) => {
                updateQuest(questLog, questId, task, i, update(task));
            });
        });
    }

}

function updateQuest(questLog: QuestLog, questId: QuestId, task: Task, taskIndex: number, update: QuestUpdate) {
    if (update === 'none') {
        return;
    }

    const currentProgression = questLog.get(questId) as QuestProgression;
    const currentProgress = currentProgression[taskIndex];

    const newProgress = Math.min(task.count, update === 'increase' ? currentProgress + 1 : update.setValue);
    if (newProgress === currentProgress) {
        return;
    }

    const progression = currentProgression.map((progress, index) => {
        if (index === taskIndex) {
            return newProgress
        }
        return progress;
    });
    questLog.set(questId, progression);
}

function increase(hasIncrease: boolean): QuestUpdate {
    return hasIncrease ? 'increase' : 'none';
}

function inventoryItem({ itemInfo, count }: ItemInfoWithCount): InventoryItem {
    return {
        itemId: itemInfo.id,
        count,
    };
}

export function spellMatchesTask(task: Task, spell: Spell): boolean {
    return task.type === 'spell' && task.spellIds.indexOf(spell.id) !== -1;
}
