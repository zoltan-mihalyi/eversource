import * as React from 'react';
import { StyleRules, WithStyles } from '../interfaces';
import { injectSheet } from '../utils';

type ClassKeys = 'root';

const styles: StyleRules<ClassKeys> = {
    root: {
        display: 'flex',
        flexFlow: 'column',
        alignItems: 'center',
    },
};

interface Props {
    margin?: boolean;
}

const RawCentered: React.ComponentType<Props & WithStyles<ClassKeys>> = ({ classes, children }) => {
    return (
        <div className={classes.root}>
            {children}
        </div>
    );
};

export const Centered = injectSheet(styles)(RawCentered);
