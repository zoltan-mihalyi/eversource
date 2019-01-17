import * as React from 'react';
import { injectSheet, SMALL_DEVICE } from '../utils';
import { StyleRules, WithStyles } from '../interfaces';
import { brown } from '../theme';


type ClassKeys = 'root';

const styles: StyleRules<ClassKeys> = {
    '@global': {
        '::-webkit-scrollbar-track': {
            background: brown.darkest,
        },

        '::-webkit-scrollbar-thumb': {
            background: brown.normalDark,
            cursor: 'url(\'../cursors/default.png\'), auto',

            '&:hover': {
                background: brown.normal,
            },
        },
        '::-webkit-scrollbar': {
            width: 12,
        },
        [SMALL_DEVICE]: {
            '::-webkit-scrollbar': {
                width: 6,
            },
        }
    },
    root: {
        fontFamily: 'pixel, serif',
        userSelect: 'none',
    },
};

interface Props {
}

const RawGui: React.FunctionComponent<Props & WithStyles<ClassKeys>> = ({ children, classes }) => (
    <div className={classes.root}>{children}</div>
);

export const Gui = injectSheet(styles)(RawGui);

