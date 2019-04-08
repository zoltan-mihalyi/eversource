import { QuestId } from '../../common/domain/InteractionTable';
import { ItemId, ItemInfo, ItemQuality } from '../../common/protocol/ItemInfo';
import { Condition } from './Condition';

export interface PresetItem {
    name: string;
    questId?: QuestId;
    condition?: Condition;
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

export function itemInfo(items: Items, itemId: ItemId): ItemInfo { // Todo index once
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