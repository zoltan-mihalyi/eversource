import { StyleRules, WithStyles } from '../interfaces';
import * as React from 'react';
import { injectSheet, SMALL_DEVICE } from '../utils';


type ClassKeys = 'root';

const styles: StyleRules<ClassKeys> = {
    root: {
        listStyleType: 'none',
        paddingLeft: 30,
        textIndent: -10,
        [SMALL_DEVICE]: {
            paddingLeft: 10,
            textIndent: 5,
        },
    },
};

interface Props {
}

const RawEnumeration: React.FunctionComponent<Props & WithStyles<ClassKeys>> = ({ children, classes }) => (
    <ul className={classes.root}>{children}</ul>
);

export const Enumeration = injectSheet(styles)(RawEnumeration);
