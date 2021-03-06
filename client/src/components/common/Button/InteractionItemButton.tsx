import { StyleRules, WithStyles } from '../../interfaces';
import * as React from 'react';
import { injectSheet } from '../../utils';
import { Button, Props as ButtonProps } from './index';
import { brown } from '../../theme';


type ClassKeys = 'root';

const styles: StyleRules<ClassKeys> = {
    root: {
        opacity: 1,
        textAlign: 'left',
        width: '100%',
        margin: 0,
        padding: 4,
        color: brown.darkest,

        '&:hover': {
            backgroundColor: 'rgba(255, 255, 160, 0.4)',
        },
    },
};

interface Props extends ButtonProps {
}

const RawInteractionItemButton: React.FunctionComponent<Props & WithStyles<ClassKeys>> = ({ children, classes, theme, ...rest }) => (
    <Button className={classes.root} {...rest}>
        {children}
    </Button>
);

export const InteractionItemButton = injectSheet(styles)(RawInteractionItemButton);
