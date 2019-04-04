import { Opaque } from '../util/Opaque';

export type ItemId = Opaque<number, 'ItemId'>;
export type SlotId = Opaque<number, 'SlotId'>;

export type ItemQuality = 'common' | 'rare' | 'epic' | 'legendary';
import { EquipmentSlotId } from '../domain/CharacterInfo';

interface EquipInfo {
    slotId: EquipmentSlotId;
}

export interface ItemInfo {
    id: ItemId;
    name: string;
    equip?: EquipInfo;
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
