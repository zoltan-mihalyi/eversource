import * as React from 'react';
import { injectSheet } from '../../utils';
import { StyleRules, WithStyles } from '../../interfaces';


type ClassKeys = 'root';

const styles: StyleRules<ClassKeys> = {
    root: {
        margin: 0,
        listStyle: 'none',
        paddingLeft: 0,
    },
};

interface Props {
}

const RawList: React.FunctionComponent<Props & WithStyles<ClassKeys>> = ({ children, classes }) => (
    <ul className={classes.root}>{children}</ul>
);

export const List = injectSheet(styles)(RawList);

