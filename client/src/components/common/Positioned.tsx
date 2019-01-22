import { StyleRules, WithStyles } from '../interfaces';
import * as React from 'react';
import { className, injectSheet } from '../utils';


type ClassKeys = 'root' | 'left' | 'stretch' | 'right' | 'top' | 'bottom';

const styles: StyleRules<ClassKeys> = {
    root: {
        position: 'absolute',
    },
    left: {
        left: 0,
    },
    right: {
        right: 0,
    },
    stretch: {
        width: '100%',
    },
    top: {
        top: 0,
    },
    bottom: {
        bottom: 0,
    },
};

interface Props {
    horizontal: 'left' | 'right' | 'stretch';
    vertical: 'top' | 'bottom';
}

const RawPositioned: React.FunctionComponent<Props & WithStyles<ClassKeys>> = ({ children, classes, horizontal, vertical }) => (
    <div className={className(classes.root, classes[horizontal], classes[vertical])}>{children}</div>
);

export const Positioned = injectSheet(styles)(RawPositioned);
