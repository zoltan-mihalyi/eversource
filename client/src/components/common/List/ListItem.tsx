import * as React from 'react';
import { className, injectSheet, SMALL_DEVICE } from '../../utils';
import { StyleRules, WithStyles } from '../../interfaces';
import { level } from '../../theme';

type ClassKeys = 'root' | 'selected' | 'status' | Level;

const styles: StyleRules<ClassKeys> = {
    root: {
        height: 40,
        paddingRight: 10,
        lineHeight: '40px',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        '&:hover': {
            backgroundColor: 'rgba(255,220,120,0.3)'
        },
        [SMALL_DEVICE]: {
            fontSize: 14,
            height: 24,
            lineHeight: '24px',
        }
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
    lowest: {
        color: level.lowest,
    },
    lower: {
        color: level.lower
    },
    normal: {
        color: level.normal
    },
    higher: {
        color: level.higher
    },
    highest: {
        color: level.highest
    },
};

export type Level = 'lowest' | 'lower' | 'normal' | 'higher' | 'highest';

interface Props {
    checked?: boolean;
    selected?: boolean;
    level?: Level;
    onClick?: () => void;
}

const RawListItem: React.FunctionComponent<Props & WithStyles<ClassKeys>> = ({ children, classes, level, checked, selected, onClick }) => (
    <li className={className(classes.root, classes[level || 'normal'], selected && classes.selected)} onClick={onClick}>
        <span className={classes.status}>{checked ? '✓ ' : ''}</span>
        {children}
    </li>
);

export const ListItem = injectSheet(styles)(RawListItem);
