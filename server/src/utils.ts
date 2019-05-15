import { Action } from '../../common/protocol/Messages';
import { Entity } from '../../common/es/Entity';
import { ServerComponents } from './es/ServerComponents';
import { CharacterInventory } from './character/CharacterInventory';
import { InventoryItem, itemInfoWithCount, Items } from './Item';
import { ItemInfoWithCount } from '../../common/protocol/ItemInfo';

export type Grouped<T> = {
    [key: string]: T[] | undefined
}

export function groupBy<T extends { [P in K]: string }, K extends keyof T>(array: T[], property: K): Grouped<T> {
    const result: Grouped<T> = {};
    for (const item of array) {
        const key = item[property];
        const itemsForKey = result[key];
        if (itemsForKey) {
            itemsForKey.push(item);
        } else {
            result[key] = [item];
        }
    }
    return result;
}

type Indexed<T> = {
    [key: string]: T | undefined;
};

export function indexBy<T extends { [P in K]: string | number }, K extends keyof T>(array: T[], property: K): Indexed<T> {
    const result: Indexed<T> = {};
    for (const item of array) {
        result[item[property]] = item;
    }
    return result;
}

export function trySendAction(entity: Entity<ServerComponents>, action: Action) {
    const { actionListener } = entity.components;
    if (actionListener) {
        actionListener.onAction(action);
    }
}

export function addToInventoryAndSendAction(items: Items, entity: Entity<ServerComponents>, inventory: CharacterInventory,
                                            inventoryItems: InventoryItem[]) {

    entity.set('inventory', inventory.add(inventoryItems));

    trySendAction(entity, {
        type: 'inventory',
        actionType: 'loot',
        items: inventoryItems.map((item) => itemInfoWithCount(items, item)),
    });
}
