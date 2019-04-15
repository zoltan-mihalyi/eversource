import * as React from 'react';
import { StyleRules, WithStyles } from '../interfaces';
import { injectSheet, NOT_SMALL_DEVICE } from '../utils';
import { brown } from '../theme';


type ClassKeys = 'root' | 'inner';

export const SLOT_PADDING = 2;
export const SLOT_SIZE = 28;
export const SCALE = 2;
export const BORDER_RADIUS = 6;

const styles: StyleRules<ClassKeys> = {
    root: {
        display: 'inline-block',
        overflow: 'hidden',

        margin: 1,

        borderRadius: BORDER_RADIUS,

        borderWidth: SLOT_PADDING,
        borderStyle: 'solid',
        borderLeftColor: brown.darkest,
        borderTopColor: brown.darkest,
        borderRightColor: brown.lighter,
        borderBottomColor: brown.lighter,

        [NOT_SMALL_DEVICE]: {
            margin: 2,
            borderRadius: BORDER_RADIUS * SCALE,
        },
    },
    inner: {
        backgroundColor: brown.normalDark,
        width: SLOT_SIZE,
        height: SLOT_SIZE,

        '&:hover': {
            backgroundColor: brown.normal,
        },

        [NOT_SMALL_DEVICE]: {
            width: SLOT_SIZE * SCALE,
            height: SLOT_SIZE * SCALE,
        },
    },
};

interface Props {
}

const RawInventorySlot: React.FunctionComponent<Props & WithStyles<ClassKeys>> = ({ children, classes }) => (
    <div className={classes.root}>
        <div className={classes.inner}>
            {children}
        </div>
    </div>
);

export const InventorySlot = injectSheet(styles)(RawInventorySlot);
