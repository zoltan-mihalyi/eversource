import { StyleRules, WithStyles } from '../../interfaces';
import * as React from 'react';
import { injectSheet, SMALL_DEVICE } from '../../utils';
import { Button, Props as ButtonProps } from './index';
import { brown, red } from '../../theme';


type ClassKeys = 'root';

const styles: StyleRules<ClassKeys> = {
    root: {
        opacity: 1,
        backgroundColor: brown.darker,
        border: '1px solid',
        borderColor: brown.normalDark,
        color: brown.lightest,
        padding: 4,
        width: 160,
        marginLeft: 10,
        marginRight: 10,

        '&:hover': {
            backgroundColor: red.darker,
        },

        [SMALL_DEVICE]: {
            width: 80,
            marginLeft: 5,
            marginRight: 5,
            padding: 2,
        }
    },
};

interface Props extends ButtonProps {
}

const RawActionButton: React.FunctionComponent<Props & WithStyles<ClassKeys>> = ({ children, classes, theme, ...rest }) => (
    <Button className={classes.root} {...rest}>
        {children}
    </Button>
);

export const ActionButton = injectSheet(styles)(RawActionButton);
