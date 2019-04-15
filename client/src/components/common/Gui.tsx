import * as React from 'react';
import { injectSheet, SMALL_DEVICE } from '../utils';
import { StyleRules, WithStyles } from '../interfaces';
import { brown, dark } from '../theme';


type ClassKeys = 'root';

const styles: StyleRules<ClassKeys> = {
    '@global': {
        html: {
            cursor: 'url("cursors/default.png"), auto',
        },

        body: {
            margin: 0,
            overflow: 'hidden',
            backgroundColor: dark,
            scrollbarColor: `${brown.normal} ${brown.darkest}`,
            '& *': {
                scrollbarWidth: 'thin',
            }
        },

        '@font-face': {
            fontFamily: 'pixel',
            src: 'url("css/alagard_by_pix3m-d6awiwp.ttf")',
        },

        'body, button, input, select, textarea': {
            fontFamily: 'pixel, serif',
        },

        'input, textarea, button, label': {
            cursor: 'inherit !important',
        },

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

        '::selection': {
            backgroundColor: brown.normalDark,
        },
        '::-moz-selection': {
            backgroundColor: brown.normalDark,
        },

        [SMALL_DEVICE]: {
            '::-webkit-scrollbar': {
                width: 6,
            },
            'p, div': {
                fontSize: 12,
            },
        },
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

