import { Opaque } from '../util/Opaque';
import { EntityId } from '../es/Entity';
import { ItemInfo } from '../protocol/ItemInfo';

export type QuestId = Opaque<number, 'QuestId'>;

export interface RequirementInfo {
    item: ItemInfo;
}

export interface TaskTrack {
    title: string;
}

export interface TaskInfo {
    count: number;
    track?: TaskTrack;
}

export interface QuestBase {
    level: number;
    name: string;
    description: string;
    taskDescription: string;
    completion: string;
}

export interface QuestInfo extends QuestBase {
    id: QuestId;
    xpReward: number;
    progress?: string;
    requirements: RequirementInfo[];
    tasks: TaskInfo[];
}

export interface InteractionTable {
    name: string;
    story: string;
    entityId: EntityId;
    acceptable: QuestInfo[];
    completable: QuestInfo[];
    completableLater: QuestInfo[];
}
