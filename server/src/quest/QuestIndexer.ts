import { groupBy, indexBy } from '../utils';
import { quests } from '../../data/quests';
import { QuestId, QuestInfo } from '../../../common/domain/InteractionTable';

export const questStarts = groupBy(quests, 'startsAt');
export const questEnds = groupBy(quests, 'endsAt');
export const questsById = indexBy(quests, 'id');

export const questInfoMap = new Map<QuestId, QuestInfo>();
for (const quest of quests) {
    questInfoMap.set(quest.id, {
        id: quest.id,
        name: quest.name,
        tasks: quest.tasks.map(({ title, count }) => ({ title, count })),
    });
}
