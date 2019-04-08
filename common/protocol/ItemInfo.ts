import { Opaque } from '../util/Opaque';

export type ItemId = Opaque<number, 'ItemId'>;
export type SlotId = Opaque<number, 'SlotId'>;

export type ItemQuality = 'common' | 'rare' | 'epic' | 'legendary';

export interface ItemInfo {
    id: ItemId;
    name: string;
    questItem: boolean,
    image: string;
    animation: string;
    quality: ItemQuality;
    lore?: string;
}

export interface ItemInfoWithCount {
    itemInfo: ItemInfo;
    count: number;
}