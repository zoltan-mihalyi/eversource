import { EventBus } from '../../../common/es/EventBus';
import { ServerEvents } from './ServerEvents';
import { EquipmentSlotId } from '../../../common/domain/CharacterInfo';
import { InventoryItem } from '../Item';
import { DataContainer } from '../data/DataContainer';

export function equipmentSystem(eventBus: EventBus<ServerEvents>, dataContainer: DataContainer) {
    const { items } = dataContainer;

    eventBus.on('equip', ({ entity, slotId, equipmentSlotId }) => {
        const { equipment, inventory } = entity.components;
        if (!equipment || !inventory) {
            return;
        }

        const item = inventory.getMap().get(slotId);
        if (!item) {
            return;
        }
        const { equip } = items[item.itemId];
        if (!equip || equip.slotId !== equipmentSlotId) {
            return;
        }

        const equipped = equipment.get(equipmentSlotId);

        const newInventory = equipped ? inventory.replace(slotId, equipped) : inventory.remove([item]);

        const newEquipment = new Map<EquipmentSlotId, InventoryItem>(equipment);
        newEquipment.set(equipmentSlotId, item);

        entity.set('inventory', newInventory);
        entity.set('equipment', newEquipment);

    });

    eventBus.on('unequip', ({ entity, equipmentSlotId }) => {
        const { equipment, inventory } = entity.components;
        if (!equipment || !inventory) {
            return;
        }

        const item = equipment.get(equipmentSlotId);
        if (!item) {
            return;
        }

        //TODO check inventory size

        const newInventory = inventory.add([item]);
        const newEquipment = new Map<EquipmentSlotId, InventoryItem>(equipment);
        newEquipment.delete(equipmentSlotId);

        entity.set('inventory', newInventory);
        entity.set('equipment', newEquipment);
    });
}
