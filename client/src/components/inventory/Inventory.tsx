import * as React from 'react';
import { ItemInfoWithCount, SlotId } from '../../../../common/protocol/ItemInfo';
import { InventoryItemIcon } from './InventoryItemIcon';
import { InventorySlot } from './InventorySlot';
import { injectSheet, SMALL_DEVICE, times } from '../utils';
import { StyleRules, WithStyles } from '../interfaces';
import { brown } from '../theme';
import { Scrollable } from '../common/Scrollable';
import { Dialog } from '../common/Dialog';
import { EquipmentSlotId } from '../../../../common/domain/CharacterInfo';

type ClassKeys = 'root';

const styles: StyleRules<ClassKeys> = {
    root: {
        backgroundColor: brown.normal,
        padding: 8,
        display: 'flex',
        flexWrap: 'wrap',

        [SMALL_DEVICE]: {
            padding: 2,
        },
    },
};

interface Props {
    slots: number;
    items: Map<SlotId, ItemInfoWithCount>;
    onClose: () => void;
    onEquip: (slotId: SlotId, equipmentSlotId: EquipmentSlotId) => void;
}

class RawInventory extends React.PureComponent<Props & WithStyles<ClassKeys>> {
    render() {
        const { classes, items, slots, onClose } = this.props;

        return (
            <Dialog title="Inventory" onClose={onClose}>
                <Scrollable>
                    <div className={classes.root}>
                        {Array.from(items.entries()).map(([slotId, item]) => (
                            <InventorySlot key={slotId}>
                                <InventoryItemIcon itemInfo={item} onClick={() => this.equip(slotId, item)}/>
                            </InventorySlot>
                        ))}

                        {times(slots - items.size, (i) => (
                            <InventorySlot key={i}/>
                        ))}
                    </div>
                </Scrollable>
            </Dialog>
        );
    }

    private equip(slotId: SlotId, item: ItemInfoWithCount) {
        const { equip } = item.itemInfo;
        if (!equip) {
            return;
        }

        this.props.onEquip(slotId, equip.slotId);
    }
}

export const Inventory = injectSheet(styles)(RawInventory);
