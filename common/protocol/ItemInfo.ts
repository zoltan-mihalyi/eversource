import { ItemId, ItemQuality } from './Inventory';

export interface ItemInfo {
    id: ItemId;
    name: string;
    questItem: boolean,
    image: string;
    animation: string;
    quality: ItemQuality;
    lore?: string;

    count: number;
}