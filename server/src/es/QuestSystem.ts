import { ServerEvents } from './ServerEvents';
import { EventBus } from '../../../common/es/EventBus';
import { questsById } from '../quest/QuestIndexer';
import { Task } from '../quest/Quest';
import { QuestId, TaskInfo } from '../../../common/domain/InteractionTable';
import { QuestProgression } from '../character/CharacterDetails';
import { QuestLog, Quests } from './ServerComponents';
import { Spells } from '../Spell';

export function questSystem(eventBus: EventBus<ServerEvents>, spells: Spells) {
    eventBus.on('kill', ({ killer, killed }) => {
        const killerQuests = killer.components.quests;
        const npcId = killed.components.npcId;

        if (!killerQuests || !npcId) {
            return;
        }

        updateQuestLog(killerQuests, task => task.type === 'kill' && task.npcIds.indexOf(npcId) !== -1);
    });

    eventBus.on('area', ({ visitor, name }) => {
        const { quests } = visitor.components;
        if (!quests) {
            return;
        }

        updateQuestLog(quests, task => task.type === 'visit' && task.areaName === name);
    });

    eventBus.on('spellCast', ({ caster, target, spell }) => {
        const { quests } = caster.components;
        if (!quests) {
            return;
        }

        updateQuestLog(quests, task => {
            return task.type === 'spell' && task.spellIds.findIndex(spellId => spells[spellId] === spell) !== -1;
        });
    });

    eventBus.on('acceptQuest', ({ quests, quest }) => {
        const questId = quest.id;

        const tasks = questsById[questId]!.tasks;
        const progression = tasks ? tasks.list.map(() => 0) : [];
        quests.questLog.set(questId, progression);
    });

    eventBus.on('completeQuest', ({ quests, quest }) => {
        const questId = quest.id;

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
}

function updateQuestLog(quests: Quests, match: (task: Task) => boolean) {
    const { questLog } = quests;

    questLog.forEach((q, questId) => {
        if (q === 'failed') {
            return;
        }
        const tasks = questsById[questId]!.tasks;
        if (!tasks) {
            return;
        }

        tasks.list.forEach((task, i) => {
            if (match(task)) {
                updateQuest(questLog, questId, task, i);
            }
        });
    });
}

function updateQuest(questLog: QuestLog, questId: QuestId, task: TaskInfo, taskIndex: number) {
    const oldProgression = questLog.get(questId) as QuestProgression;

    if (oldProgression[taskIndex] === task.count) {
        return;
    }

    const progression = oldProgression.map((progress, index) => {
        if (index === taskIndex) {
            return progress + 1;
        }
        return progress;
    });
    questLog.set(questId, progression);
}
