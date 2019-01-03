import * as React from 'react';
import { StyleRules, WithStyles } from '../interfaces';
import { className, injectSheet, SMALL_DEVICE } from '../utils';
import { brown } from '../theme';

type ClassKeys = 'root' | 'margin';

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
        }
    },
    margin: {
        margin: 14,
        [SMALL_DEVICE]: {
            margin: 8,
        }
    }
};

interface Props {
    margin?: boolean;
}

const RawPanel: React.ComponentType<Props & WithStyles<ClassKeys>> = ({ classes, children, margin }) => {
    return (
        <div className={className(classes.root, margin && classes.margin)}>
            {children}
        </div>
    );
};

export const Panel = injectSheet(styles)(RawPanel);
