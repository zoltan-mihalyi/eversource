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
    completion: string;
    tasks: TaskInfo[];
}

export interface InteractionTable {
    entityId: EntityId;
    acceptable: QuestInfo[];
    completable: QuestInfo[];
}