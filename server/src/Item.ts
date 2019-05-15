import { QuestId } from '../../common/domain/InteractionTable';
import { ItemId, ItemInfo, ItemInfoWithCount, ItemQuality } from '../../common/protocol/ItemInfo';
import { Condition } from './Condition';
import { EquipmentSlotId } from '../../common/domain/CharacterInfo';
import { ColoredImage } from '../../common/domain/ColoredImage';

export interface ItemEquip {
    slotId: EquipmentSlotId;
    image: ColoredImage;
}

export interface PresetItem {
    name: string;
    questId?: QuestId;
    condition?: Condition;
    stackSize?: number;
    equip?: ItemEquip;
    image: string;
    animation: string;
    quality: ItemQuality;
    lore?: string;
}

export interface InventoryItem {
    readonly itemId: ItemId;
    readonly count: number;
}

export interface Items {
    [id: number]: PresetItem;
}

export function itemInfo(items: Items, itemId: ItemId): ItemInfo { // Todo index once
    const { name, image, animation, quality, lore, equip, questId } = items[itemId];

    return {
        id: itemId,
        name,
        equip: equip && { slotId: equip.slotId },
        questItem: typeof questId === 'number',
        image,
        animation,
        quality,
        lore,
    };
}

export function itemInfoWithCount(items: Items, { itemId, count }: InventoryItem): ItemInfoWithCount {
    return {
        count,
        itemInfo: itemInfo(items, itemId)
    };
}