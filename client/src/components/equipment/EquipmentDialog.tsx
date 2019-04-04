import * as React from 'react';
import { equipmentSlotName, injectSheet, SMALL_DEVICE } from '../utils';
import { StyleRules, WithStyles } from '../interfaces';
import { brown } from '../theme';
import { Scrollable } from '../common/Scrollable';
import { Dialog } from '../common/Dialog';
import { InventorySlot } from '../inventory/InventorySlot';
import { InventoryItemIcon } from '../inventory/InventoryItemIcon';
import { EQUIPMENT_SLOTS } from '../../../../common/components/View';
import { EquipmentSlotId } from '../../../../common/domain/CharacterInfo';
import { ItemInfo, ItemInfoWithCount } from '../../../../common/protocol/ItemInfo';

type ClassKeys = 'root' | 'text';

const styles: StyleRules<ClassKeys> = {
    root: {
        backgroundColor: brown.normal,
        padding: 8,
        display: 'flex',
        flexWrap: 'wrap',

        [SMALL_DEVICE]: {
            padding: 2,
        }
    },
    text: {
        textAlign: 'center',
        fontSize: 16,
        paddingTop: 34,

        [SMALL_DEVICE]: {
            fontSize: 10,
            paddingTop: 14,
        }
    },
};

interface Props {
    equipment: Map<EquipmentSlotId, ItemInfoWithCount>;
    onClose: () => void;
}

class RawEquipmentDialog extends React.PureComponent<Props & WithStyles<ClassKeys>> {
    render() {
        const { classes, equipment, onClose } = this.props;

        return (
            <Dialog title="Equipment" onClose={onClose}>
                <Scrollable>
                    <div className={classes.root}>
                        {EQUIPMENT_SLOTS.map(equipmentSlotId => (
                            <InventorySlot key={equipmentSlotId}>
                                {equipment.has(equipmentSlotId) ? (
                                    <InventoryItemIcon itemInfo={equipment.get(equipmentSlotId)!}/>
                                ) : (
                                    <div className={classes.text}>{equipmentSlotName(equipmentSlotId)}</div>
                                )}
                            </InventorySlot>
                        ))}
                    </div>
                </Scrollable>
            </Dialog>
        );
    }
}

export const EquipmentDialog = injectSheet(styles)(RawEquipmentDialog);
