import * as React from 'react';
import { injectSheet, SMALL_DEVICE } from '../../utils';
import { StyleRules, WithStyles } from '../../interfaces';
import { ListItem, Props as ListItemProps } from './ListItem';
import { LevelColoredText } from '../../character/LevelColoredText';

type ClassKeys = 'root' | 'status';

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
};

export type Level = 'lowest' | 'lower' | 'normal' | 'higher' | 'highest';

interface Props extends ListItemProps {
    checked?: boolean;
    level?: Level;
}

const RawTextListItem: React.FunctionComponent<Props & WithStyles<ClassKeys>> = ({ children, classes, level, checked, ...rest }) => (
    <ListItem {...rest}>
        <div className={classes.root}>
            <LevelColoredText level={level || 'normal'}>
                <span className={classes.status}>{checked ? '✓ ' : ''}</span>
                {children}
            </LevelColoredText>
        </div>
    </ListItem>
);

export const TextListItem = injectSheet(styles)(RawTextListItem);
