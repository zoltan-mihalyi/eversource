import * as React from 'react';
import { className, injectSheet } from '../../utils';
import { StyleRules, WithStyles } from '../../interfaces';

type ClassKeys = 'root' | 'selected' | 'status';

const styles: StyleRules<ClassKeys> = {
    root: {
        '&:hover': {
            backgroundColor: 'rgba(255,220,120,0.3)'
        },
    },
    selected: {
        backgroundColor: 'rgba(255,220,120,0.2)'
    },
    status: {
        display: 'inline-block',
        width: 22,
        textAlign: 'right',
        marginRight: 3,
    },
};

export type Level = 'lowest' | 'lower' | 'normal' | 'higher' | 'highest';

export interface Props {
    selected?: boolean;
    onClick?: () => void;
}

const RawListItem: React.FunctionComponent<Props & WithStyles<ClassKeys>> = ({ children, classes, selected, onClick }) => (
    <li className={className(classes.root, selected && classes.selected)} onClick={onClick}>
        {children}
    </li>
);

export const ListItem = injectSheet(styles)(RawListItem);
