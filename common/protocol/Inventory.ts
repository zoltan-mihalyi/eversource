import { Opaque } from '../util/Opaque';
import { ItemInfo } from './ItemInfo';

export type ItemId = Opaque<number, 'ItemId'>;
export type SlotId = Opaque<number, 'SlotId'>;

export type ItemQuality = 'common' | 'rare' | 'epic' | 'legendary';

export interface InventoryItemInfo extends ItemInfo {
    slotId: SlotId;
}
