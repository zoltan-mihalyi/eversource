import { groupBy, indexBy } from '../utils';
import { quests } from '../../data/quests';

export const questStarts = groupBy(quests, 'startsAt');
export const questEnds = groupBy(quests, 'endsAt');
export const questsById = indexBy(quests, 'id');
