import * as React from 'react';
import { StyleRules, WithStyles } from '../interfaces';
import { black, brown, lore, quality, quest } from '../theme';
import { ItemInfo } from '../../../../common/protocol/ItemInfo';
import { injectSheet, SMALL_DEVICE } from '../utils';

type ClassKeys = 'root' | 'questItem' | 'lore';

const styles: StyleRules<ClassKeys> = {
    root: {
        opacity: 0.8,
        backgroundColor: black,
        color: brown.lightest,
        borderStyle: 'solid',
        borderWidth: 2,
        borderColor: brown.normal,
        padding: 8,
        borderRadius: 4,
        lineHeight: 1.5,
        fontSize: 18,

        [SMALL_DEVICE]: {
            fontSize: 12,
        },

        '& > h3': {
            fontSize: 20,
            whiteSpace: 'nowrap',
            fontWeight: 'normal',

            [SMALL_DEVICE]: {
                fontSize: 16
            }
        },

        '& > p, & > h3': {
            marginTop: 0,
            marginBottom: 0,
        }
    },
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

export const RawInventoryItemTooltip: React.FunctionComponent<Props & WithStyles<ClassKeys>> = ({ item, classes }) => (
    <div className={classes.root}>
        <h3 style={{ color: quality[item.quality] }}>{item.name}</h3>
        {item.questItem && <p className={classes.questItem}>Quest Item</p>}
        {item.lore && <p className={classes.lore}>{item.lore}</p>}
    </div>
);

export const InventoryItemTooltip = injectSheet(styles)(RawInventoryItemTooltip);
