import * as React from 'react';
import { StyleRules, WithStyles } from '../interfaces';
import { lore, quality, quest } from '../theme';
import { ItemInfo } from '../../../../common/protocol/ItemInfo';
import { equipmentSlotName, injectSheet, SMALL_DEVICE } from '../utils';
import TooltipBox from '../common/TooltipBox';

type ClassKeys = 'questItem' | 'lore';

const styles: StyleRules<ClassKeys> = {
    questItem: {
        color: quest.active,
    },
    lore: {
        color: lore,
        fontStyle: 'italic',
        fontSize: 16,

        [SMALL_DEVICE]: {
            fontSize: 12,
        },
    }
};

interface Props {
    item: ItemInfo;
}

const RawInventoryItemTooltip: React.FunctionComponent<Props & WithStyles<ClassKeys>> = ({ item, classes }) => (
    <TooltipBox>
        <h3 style={{ color: quality[item.quality] }}>{item.name}</h3>
        {item.questItem && <p className={classes.questItem}>Quest Item</p>}
        {item.equip && <p>{equipmentSlotName(item.equip.slotId)}</p>}
        {item.lore && <p className={classes.lore}>{item.lore}</p>}
    </TooltipBox>
);

export const InventoryItemTooltip = injectSheet(styles)(RawInventoryItemTooltip);
