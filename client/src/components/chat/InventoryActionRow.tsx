import * as React from 'react';
import { InventoryAction } from '../../../../common/protocol/Messages';
import { StyleRules, WithStyles } from '../interfaces';
import { brown, quality } from '../theme';
import { injectSheet } from '../utils';
import { InventoryItemTooltip } from '../inventory/InventoryItemTooltip';
import Tooltip from 'react-tooltip-lite';

type ClassKeys = 'message';

const styles: StyleRules<ClassKeys> = {
    message: {
        color: brown.lighter,
    },
};

interface Props {
    action: InventoryAction;
}

const RawInventoryActionRow: React.FunctionComponent<Props & WithStyles<ClassKeys>> = ({ action, classes }) => (
    <span className={classes.message}>
        {action.actionType === 'loot' ? 'Received' : 'Destroyed'}
        {' '}
        {action.items.map((item, i) => (
            <React.Fragment key={i}>
                {i > 0 && ', '}
                <Tooltip arrow={false} tagName="span" styles={{ color: quality[item.itemInfo.quality] }}
                         content={<InventoryItemTooltip item={item.itemInfo}/>}>
                    [{item.itemInfo.name}]
                </Tooltip>
                {item.count > 1 && `x${item.count}`}
            </React.Fragment>
        ))}
        .
    </span>
);

export const InventoryActionRow = injectSheet(styles)(RawInventoryActionRow);
