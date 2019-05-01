import { ServerEvents } from './ServerEvents';
import { EventBus } from '../../../common/es/EventBus';
import { LootElement } from '../world/Presets';
import { InventoryItem } from '../Item';
import { getRemainingCount } from '../Condition';
import { Entity } from '../../../common/es/Entity';
import { ServerComponents } from './ServerComponents';
import { Tasks } from '../quest/Quest';
import { DataContainer } from '../data/DataContainer';
import { CharacterInventory } from '../character/CharacterInventory';

export function lootSystem(eventBus: EventBus<ServerEvents>, dataContainer: DataContainer) {

    eventBus.on('loot', ({ entity, looted, loot }) => {
        const { inventory } = entity.components;

        if (!inventory) {
            return;
        }
        const items = createItemsFromLoot(entity, inventory, loot);
        if (items.length === 0) {
            return;
        }

        entity.set('inventory', inventory.add(items));
        eventBus.emit('kill', { killer: entity, killed: looted });
    });

    function createItemsFromLoot(entity: Entity<ServerComponents>, inventory: CharacterInventory, loot: LootElement[]): InventoryItem[] {
        const inventoryItems: InventoryItem[] = [];
        for (const lootElement of loot) {
            const { condition } = dataContainer.items[lootElement.itemId];


            if (Math.random() > lootElement.chance) {
                continue;
            }

            const getRemainingItemCount = (tasks: Tasks): number => {
                return getRemainingItemCountForLoot(tasks, inventory, lootElement);
            };

            const maxLoot = condition ? getRemainingCount(condition, entity, dataContainer, getRemainingItemCount) : Infinity;

            const extraCount = Math.floor(Math.random() * (lootElement.maxCount - lootElement.minCount));
            const count = Math.min(maxLoot, lootElement.minCount + extraCount);

            if (count === 0) {
                continue;
            }

            inventoryItems.push({
                itemId: lootElement.itemId,
                count,
            });
        }
        return inventoryItems;
    }
}

export function getRemainingItemCountForLoot(tasks: Tasks, inventory: CharacterInventory, lootElement: LootElement) {
    for (const task of tasks.requirements) {
        if (task.itemId === lootElement.itemId) {
            return task.count - inventory.getCount(task.itemId);
        }
    }
    return 0;
}