import * as React from 'react';
import { StyleRules, WithStyles } from '../interfaces';
import { className, injectSheet, SMALL_DEVICE } from '../utils';
import { brown } from '../theme';

type ClassKeys = 'root' | 'margin' | 'padding';

const styles: StyleRules<ClassKeys> = {
    root: {
        backgroundColor: brown.darkest,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: brown.normal,
        color: brown.lighter,
        display: 'inline-block',
        fontSize: 24,
        [SMALL_DEVICE]: {
            fontSize: 12,
        },
        overflow: 'hidden',
    },
    margin: {
        margin: 14,
        [SMALL_DEVICE]: {
            margin: 8,
        }
    },
    padding: {
        padding: 14,
        [SMALL_DEVICE]: {
            padding: 8,
        }
    },
};

interface Props {
    margin?: boolean;
    padding?: boolean;
}

const RawPanel: React.ComponentType<Props & WithStyles<ClassKeys>> = ({ classes, children, margin, padding }) => {
    return (
        <div className={className(classes.root, margin && classes.margin, padding && classes.padding)}>
            {children}
        </div>
    );
};

export const Panel = injectSheet(styles)(RawPanel);
