import { EntityId } from './EntityData';
import { Opaque } from '../util/Opaque';

export type QuestId = Opaque<number, 'QuestId'>;

export interface QuestInfo {
    id: QuestId;
    name: string;
}

export interface InteractionTable {
    entityId: EntityId;
    acceptable: QuestInfo[];
    completable: QuestInfo[];
}