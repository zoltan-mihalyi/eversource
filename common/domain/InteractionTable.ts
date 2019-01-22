import { EntityId } from './EntityData';
import { Opaque } from '../util/Opaque';

export type QuestId = Opaque<number, 'QuestId'>;

export interface TaskInfo {
    count: number;
    title: string;
}

export interface QuestBase {
    id: QuestId;
    level: number;
    name: string;
    description: string;
    taskDescription: string;
    completion: string;
}

export interface QuestInfo extends QuestBase {
    xpReward: number;
    progress?: string;
    tasks: TaskInfo[];
}

export interface InteractionTable {
    name: string;
    entityId: EntityId;
    acceptable: QuestInfo[];
    completable: QuestInfo[];
    completableLater: QuestInfo[];
}