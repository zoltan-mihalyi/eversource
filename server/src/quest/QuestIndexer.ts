import { groupBy, Grouped } from '../utils';
import { QuestId, QuestInfo, RequirementInfo, TaskInfo } from '../../../common/domain/InteractionTable';
import { questXpReward } from '../../../common/algorithms';
import { PresetQuest, Quest, Tasks } from './Quest';
import { itemInfo, Items } from '../Item';

export class QuestIndexer {
    readonly quests = new Map<QuestId, Quest>();
    readonly questStarts: Grouped<Quest>;
    readonly questEnds: Grouped<Quest>;
    readonly questInfoMap = new Map<QuestId, QuestInfo>();

    constructor(presetQuests: { [questId: number]: PresetQuest }, items: Items) {
        const quests: Quest[] = [];
        for (const key of Object.keys(presetQuests)) {
            const questId = +key as QuestId;
            const quest: Quest = {
                id: questId,
                ...presetQuests[questId],
            };
            this.quests.set(questId, quest);
            quests.push(quest);
        }

        this.questStarts = groupBy(quests, 'startsAt');
        this.questEnds = groupBy(quests, 'endsAt');

        for (const quest of quests) {
            const questTasks = quest.tasks;
            const tasks = getTasks(questTasks);
            const requirements = getRequirements(items, questTasks);
            const questInfo: QuestInfo = {
                id: quest.id,
                level: quest.level,
                xpReward: questXpReward(quest.level, quest.difficulty),
                name: quest.name,
                description: quest.description,
                taskDescription: quest.taskDescription,
                completion: quest.completion,
                tasks,
                requirements,
            };
            if (questTasks) {
                questInfo.progress = questTasks.progress;
            }
            this.questInfoMap.set(quest.id, questInfo);
        }
    }
}

function getTasks(questTasks?: Tasks): TaskInfo[] {
    if (!questTasks) {
        return [];
    }

    return [...questTasks.list, ...questTasks.requirements].map(({ track, count }) => ({ track, count }));
}

function getRequirements(items: Items, questTasks?: Tasks): RequirementInfo[] {
    if (!questTasks) {
        return [];
    }
    return questTasks.requirements.map(({ count, itemId }) => ({
        item: Object.assign(itemInfo(items, itemId), { count }),
    }));
}
