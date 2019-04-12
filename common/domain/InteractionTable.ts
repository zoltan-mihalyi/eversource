import { Opaque } from '../util/Opaque';
import { EntityId } from '../es/Entity';
import { ItemInfoWithCount } from '../protocol/ItemInfo';

export type QuestId = Opaque<number, 'QuestId'>;

export interface RequirementInfo extends ItemInfoWithCount {
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

export interface ItemQuestRewardInfo extends ItemInfoWithCount {
    type: 'item';
}

export type QuestRewardInfo = ItemQuestRewardInfo;

export interface RewardOptionsInfo {
    options: QuestRewardInfo[];
}

export interface QuestInfo extends QuestBase {
    id: QuestId;
    xpReward: number;
    progress?: string;
    requirements: RequirementInfo[];
    tasks: TaskInfo[];
    rewards: RewardOptionsInfo[];
}

export interface InteractionTable {
    name: string;
    story: string;
    entityId: EntityId;
    acceptable: QuestInfo[];
    completable: QuestInfo[];
    completableLater: QuestInfo[];
}
