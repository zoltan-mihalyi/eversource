import * as React from 'react';
import { injectSheet } from '../utils';
import { StyleRules, WithStyles } from '../interfaces';


type ClassKeys = 'root';

const styles: StyleRules<ClassKeys> = {
    root: {
        listStyle: 'none',
        paddingLeft: 0,
    },
};

interface Props {
}

const RawInteractionItemList: React.FunctionComponent<Props & WithStyles<ClassKeys>> = ({ children, classes }) => (
    <ul className={classes.root}>{children}</ul>
);

export const InteractionItemList = injectSheet(styles)(RawInteractionItemList);

