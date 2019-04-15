import * as React from 'react';
import { className, injectSheet, SMALL_DEVICE } from '../../utils';
import { StyleRules, WithStyles } from '../../interfaces';
import { level } from '../../theme';
import { ListItem, Props as ListItemProps } from './ListItem';

type ClassKeys = 'root' | 'status' | Level;

const styles: StyleRules<ClassKeys> = {
    root: {
        height: 40,
        paddingRight: 10,
        lineHeight: '40px',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        [SMALL_DEVICE]: {
            fontSize: 14,
            height: 24,
            lineHeight: '24px',
        }
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

interface Props extends ListItemProps {
    checked?: boolean;
    level?: Level;
}

const RawTextListItem: React.FunctionComponent<Props & WithStyles<ClassKeys>> = ({ children, classes, level, checked, ...rest }) => (
    <ListItem {...rest}>
        <div className={className(classes.root, classes[level || 'normal'])}>
            <span className={classes.status}>{checked ? '✓ ' : ''}</span>
            {children}
        </div>
    </ListItem>
);

export const TextListItem = injectSheet(styles)(RawTextListItem);
