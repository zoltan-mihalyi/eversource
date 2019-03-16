import { ServerEvents } from './ServerEvents';
import { EventBus } from '../../../common/es/EventBus';
import { LootElement } from '../world/Presets';
import { InventoryItem } from '../Item';

export function lootSystem(eventBus: EventBus<ServerEvents>) {

    eventBus.on('loot', ({ entity, loot }) => {
        const { inventory } = entity.components;

        if (inventory) {
            entity.set('inventory', inventory.add(createItemsFromLoot(loot)));
            return;
        }
    });
}

function createItemsFromLoot(loot: LootElement[]): InventoryItem[] {
    const items: InventoryItem[] = [];
    for (const lootElement of loot) {
        if (Math.random() > lootElement.chance) {
            continue;
        }

        const extraCount = Math.floor(Math.random() * (lootElement.maxCount - lootElement.minCount));
        items.push({
            itemId: lootElement.itemId,
            count: lootElement.minCount + extraCount,
        });
    }
    return items;
}