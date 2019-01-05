import { StyleRules, WithStyles } from '../interfaces';
import * as React from 'react';
import { className, injectSheet, SMALL_DEVICE } from '../utils';
import { brown } from '../theme';


type ClassKeys = 'root' | 'fixedHeight' | 'paper' | 'padding';

const styles: StyleRules<ClassKeys> = {
    root: {
        maxHeight: 440,
        overflowY: 'auto',
        flexGrow: 1,
        width: 360,
        [SMALL_DEVICE]: {
            maxHeight: 220,
            width: 180,
        }
    },
    fixedHeight: {
        height: 440,
        flexShrink: 0,
        [SMALL_DEVICE]: {
            height: 220,
        }
    },
    paper: {
        backgroundImage: "url(css/game/paper.png)",
        color: brown.darkest,
    },
    padding: {
        padding: 12,
        [SMALL_DEVICE]: {
            padding: 6,
        },
    },
};

interface Props {
    variant?: 'paper';
    padding?: boolean;
    fixedHeight?: boolean;
}

const RawScrollable: React.FunctionComponent<Props & WithStyles<ClassKeys>> = ({ children, variant, padding, fixedHeight, classes }) => (
    <div className={className(classes.root, variant && classes[variant], fixedHeight && classes.fixedHeight)}>
        <div className={className(padding && classes.padding)}>
            {children}
        </div>
    </div>
);

export const Scrollable = injectSheet(styles)(RawScrollable);
