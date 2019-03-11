import { QuestId } from '../../common/domain/InteractionTable';
import { ItemId, ItemQuality } from '../../common/protocol/Inventory';
import { ItemInfo } from '../../common/protocol/ItemInfo';
import { Omit } from '../../common/util/Omit';

export interface PresetItem {
    name: string;
    questId?: QuestId;
    stackSize?: number;
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

export function itemInfo(items: Items, itemId: ItemId): Omit<ItemInfo, 'count'> {
    const { name, image, animation, quality, lore, questId } = items[itemId];

    return {
        id: itemId,
        name,
        questItem: typeof questId === 'number',
        image,
        animation,
        quality,
        lore,
    };
}