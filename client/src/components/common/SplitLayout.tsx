import { StyleRules, WithStyles } from '../interfaces';
import * as React from 'react';
import { injectSheet, SMALLEST_DEVICE } from '../utils';


type ClassKeys = 'root';

const styles: StyleRules<ClassKeys> = {
    root: {
        display: 'flex',
        [SMALLEST_DEVICE]: {
            flexDirection: 'column',
            height: 320,
        }
    },
};

interface Props {
}

const RawSplitLayout: React.FunctionComponent<Props & WithStyles<ClassKeys>> = ({ children, classes }) => (
    <div className={classes.root}>{children}</div>
);

export const SplitLayout = injectSheet(styles)(RawSplitLayout);
