import { groupBy, indexBy } from '../utils';
import { quests } from '../../data/quests';
import { QuestId, QuestInfo } from '../../../common/domain/InteractionTable';
import { QuestDifficulty } from './Quest';

export const questStarts = groupBy(quests, 'startsAt');
export const questEnds = groupBy(quests, 'endsAt');
export const questsById = indexBy(quests, 'id');

export const questInfoMap = new Map<QuestId, QuestInfo>();
for (const quest of quests) {
    const questTasks = quest.tasks;
    const tasks = questTasks ? questTasks.list.map(({ title, count }) => ({ title, count })) : [];
    const questInfo: QuestInfo = {
        id: quest.id,
        level: quest.level,
        xpReward: xpReward(quest.level, quest.difficulty),
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

function xpReward(questLevel: number, difficulty: QuestDifficulty) {
    const base = Math.sqrt(questLevel) * 60;

    switch (difficulty) {
        case 'easy':
            return round(base / 2);
        case 'normal':
            return round(base);
        case 'hard':
            return round(base * 2);
    }
}

function round(xp: number): number {
    const roundTo = Math.pow(10, Math.floor(Math.log10(xp)) - 1);
    return Math.round(xp / roundTo) * roundTo;

}