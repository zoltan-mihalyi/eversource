import { EntityId } from './EntityData';
import { Opaque } from '../util/Opaque';

export type QuestId = Opaque<number, 'QuestId'>;

export interface TaskInfo {
    count: number;
    title: string;
}

export interface QuestInfo {
    id: QuestId;
    name: string;
    description: string;
    taskDescription: string;
    completion: string;
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