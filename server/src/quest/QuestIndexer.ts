import { groupBy, indexBy } from '../utils';
import { quests } from '../../data/quests';
import { QuestId, QuestInfo } from '../../../common/domain/InteractionTable';

export const questStarts = groupBy(quests, 'startsAt');
export const questEnds = groupBy(quests, 'endsAt');
export const questsById = indexBy(quests, 'id');

export const questInfoMap = new Map<QuestId, QuestInfo>();
for (const quest of quests) {
    const questTasks = quest.tasks;
    const tasks = questTasks ? questTasks.list.map(({ title, count }) => ({ title, count })) : [];
    const questInfo: QuestInfo = {
        id: quest.id,
        name: quest.name,
        description: quest.description,
        taskDescription: quest.taskDescription,
        completion: quest.completion,
        tasks,
    };
    if (questTasks) {
        questInfo.progress = questTasks.progress;
    }
    questInfoMap.set(quest.id, questInfo);
}
