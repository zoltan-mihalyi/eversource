import { EntityContainer } from '../../../common/es/EntityContainer';
import { ServerComponents, ViewBase } from './ServerComponents';
import { Entity } from '../../../common/es/Entity';
import { EQUIPMENT_SLOTS, EquipmentView, View } from '../../../common/components/View';
import { DataContainer } from '../data/DataContainer';
import { Equipment } from '../../../common/domain/CharacterInfo';

export function equipmentViewSystem(container: EntityContainer<ServerComponents>, dataContainer: DataContainer) {
    const { items } = dataContainer;

    const entitiesWithViewBase = container.createQuery('viewBase');
    const entitiesWithInventory = container.createQuery('equipment');

    entitiesWithViewBase.on('add', setView);
    entitiesWithViewBase.on('update', setView);

    entitiesWithInventory.on('add', setView);
    entitiesWithInventory.on('update', setView);

    function setView({ viewBase, equipment }: Partial<ServerComponents>, entity: Entity<ServerComponents>) {
        if (!viewBase) {
            return;
        }
        entity.set('view', createView(viewBase, equipment));
    }

    function createView(viewBase: ViewBase, equipment?: Equipment): View {
        if (viewBase.type === 'object' || viewBase.type === 'simple') {
            return viewBase;
        }

        const equipmentView: EquipmentView = {
            mask: [], //TODO collect these props
        } as EquipmentView;
        for (const equipmentSlotId of EQUIPMENT_SLOTS) {
            const equipmentItem = equipment && equipment.get(equipmentSlotId);
            equipmentView[equipmentSlotId] = equipmentItem ? items[equipmentItem.itemId].equip!.image : [];
        }

        return {
            type: 'humanoid',
            appearance: viewBase.appearance,
            equipment: equipmentView,
        };
    }
}

