import * as React from 'react';
import { className, injectSheet, SMALL_DEVICE } from '../../utils';
import { StyleRules, WithStyles } from '../../interfaces';
import { brown } from '../../theme';


type ClassKeys = 'root' | 'bordered';

const styles: StyleRules<ClassKeys> = {
    root: {
        margin: 0,
        listStyle: 'none',
        paddingLeft: 0,
        display: 'flex',
        flexDirection: 'column',
    },
    bordered: {
        '& > li': {
            borderStyle: 'solid',
            borderWidth: 4,
            marginRight: 4,
            marginBottom: 8,
            borderTopColor: brown.lighter,
            borderLeftColor: brown.normal,
            borderRightColor: brown.normal,
            borderBottomColor: brown.normalDark,

            [SMALL_DEVICE]: {
                borderWidth: 2,
                marginRight: 2,
                marginBottom: 4,
            },
        },
    }
};

interface Props {
    bordered?: boolean;
}

const RawList: React.FunctionComponent<Props & WithStyles<ClassKeys>> = ({ children, classes, bordered }) => (
    <ul className={className(classes.root, bordered && classes.bordered)}>{children}</ul>
);

export const List = injectSheet(styles)(RawList);

