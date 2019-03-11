import { ItemId, SlotId } from '../../../common/protocol/Inventory';
import { InventoryItem, Items } from '../Item';

export class CharacterInventory {
    private nextId = 0;
    private map = new Map<SlotId, InventoryItem>();

    constructor(private items: Items, inventoryItems: InventoryItem[] = []) {
        for (const item of inventoryItems) {
            this.addItem(item);
        }
    }

    private addItem(inventoryItem: InventoryItem) {
        const { itemId, count } = inventoryItem;
        const stackSize = this.items[itemId].stackSize || 1;

        let remaining = this.addCountToExistingItems(itemId, count, stackSize);
        this.addToNewSlots(itemId, remaining, stackSize);
    }

    private removeItem(inventoryItem: InventoryItem) {
        const { itemId, count } = inventoryItem;

        let remaining = count;
        this.map.forEach((item, slotId) => {
            if (remaining === 0) {
                return;
            }
            if (item.itemId !== itemId) {
                return;
            }
            const amountToRemove = Math.min(remaining, item.count);
            if (amountToRemove === item.count) {
                this.map.delete(slotId);
            } else {
                this.map.set(slotId, { itemId, count: item.count - amountToRemove });
            }
            remaining -= amountToRemove;
        });
    }

    private addCountToExistingItems(itemId: ItemId, count: number, stackSize: number): number {
        let remaining = count;


        this.map.forEach((inventoryItem, slotId) => {
            if (remaining === 0) {
                return;
            }
            if (inventoryItem.itemId !== itemId) {
                return;
            }
            const remainingInStack = stackSize - inventoryItem.count;
            if (remainingInStack <= 0) {
                return;
            }
            const amountToAdd = Math.min(remaining, remainingInStack);
            this.map.set(slotId, { count: inventoryItem.count + amountToAdd, itemId });
            remaining -= amountToAdd;
        });
        return remaining;
    }

    private addToNewSlots(itemId: ItemId, count: number, stackSize: number) {
        let remaining = count;

        while (remaining > 0) {
            const amountToAdd = Math.min(stackSize, remaining);
            this.map.set(this.nextId++ as SlotId, { itemId, count: amountToAdd });
            remaining -= amountToAdd;
        }
    }

    getCount(itemId: ItemId) {
        let sum = 0;
        this.map.forEach((inventoryItem) => {
            if (inventoryItem.itemId === itemId) {
                sum += inventoryItem.count;
            }
        });
        return sum;
    }

    getMap(): ReadonlyMap<SlotId, InventoryItem> {
        return this.map;
    }

    remove(items: InventoryItem[]): CharacterInventory {
        const copy = new CharacterInventory(this.items);
        copy.map = new Map<SlotId, InventoryItem>(this.map);
        copy.nextId = this.nextId;
        for (const item of items) {
            copy.removeItem(item);
        }
        return copy;
    }
}
