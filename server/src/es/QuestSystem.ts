import { ServerEvents } from './ServerEvents';
import { EventBus } from '../../../common/es/EventBus';
import { Task } from '../quest/Quest';
import { QuestId, RequirementInfo, TaskInfo } from '../../../common/domain/InteractionTable';
import { QuestProgression } from '../character/CharacterDetails';
import { QuestLog, Quests } from './ServerComponents';
import { Spells } from '../Spell';
import { QuestIndexer } from '../quest/QuestIndexer';
import { InventoryItem } from '../Item';

type QuestUpdate = 'none' | 'increase' | { setValue: number };

export function questSystem(eventBus: EventBus<ServerEvents>, spells: Spells, questIndexer: QuestIndexer) {

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
            return increase(task.type === 'spell' && task.spellIds.findIndex(spellId => spells[spellId] === spell) !== -1); // TODO spell should contain id
        });
    });

    eventBus.on('acceptQuest', ({ quests, quest }) => {
        const tasks = questIndexer.quests.get(quest.id)!.tasks;
        const progression = tasks ? tasks.list.map(() => 0) : [];
        quests.questLog.set(quest.id, progression);
    });

    eventBus.on('completeQuest', ({ entity, quests, quest }) => {
        const questId = quest.id;

        const requiredItems = quest.requirements.map(({ item }: RequirementInfo): InventoryItem => ({
            itemId: item.id,
            count: item.count,
        }));
        const inventory = entity.components.inventory!.remove(requiredItems);
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

function updateQuest(questLog: QuestLog, questId: QuestId, task: TaskInfo, taskIndex: number, update: QuestUpdate) {
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
