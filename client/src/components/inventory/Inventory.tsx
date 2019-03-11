import * as React from 'react';
import { InventoryItemInfo } from '../../../../common/protocol/Inventory';
import { InventoryItemIcon } from './InventoryItemIcon';
import { InventorySlot } from './InventorySlot';
import { injectSheet, SMALL_DEVICE, times } from '../utils';
import { StyleRules, WithStyles } from '../interfaces';
import { brown } from '../theme';
import { Scrollable } from '../common/Scrollable';
import { Dialog } from '../common/Dialog';

type ClassKeys = 'root';

const styles: StyleRules<ClassKeys> = {
    root: {
        backgroundColor: brown.normal,
        padding: 8,
        display: 'flex',
        flexWrap: 'wrap',

        [SMALL_DEVICE]:{
            padding: 2,
        }
    }
};

interface Props {
    slots: number;
    items: InventoryItemInfo[];
    onClose: () => void;
}

class RawInventory extends React.PureComponent<Props & WithStyles<ClassKeys>> {
    render() {
        const { classes, items, slots, onClose } = this.props;

        return (
            <Dialog title="Inventory" onClose={onClose}>
                <Scrollable>
                    <div className={classes.root}>
                        {items.map(item => (
                            <InventorySlot key={item.slotId}>
                                <InventoryItemIcon item={item}/>
                            </InventorySlot>
                        ))}

                        {times(slots - items.length, (i) => (
                            <InventorySlot key={i}/>
                        ))}
                    </div>
                </Scrollable>
            </Dialog>
        );
    }
}

export const Inventory = injectSheet(styles)(RawInventory);
