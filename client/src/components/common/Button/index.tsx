import { StyleRules, WithStyles } from '../../interfaces';
import * as React from 'react';
import { className as classNameFunction, injectSheet, SMALL_DEVICE } from '../../utils';


type ClassKeys = 'root';

const styles: StyleRules<ClassKeys> = {
    root: {
        fontFamily: 'pixel, serif',
        border: 0,
        background: 'none',
        padding: 0,
        margin: 2,
        opacity: 0.7,
        fontSize: 24,
        '&:focus': {
            outline: 0,
        },

        [SMALL_DEVICE]: {
            fontSize: 12,
        }
    },
};

export interface Props {
    className?: string;
    onClick?: () => void;
}

const RawButton: React.FunctionComponent<Props & WithStyles<ClassKeys>> = ({ children, classes, className, onClick }) => (
    <button tabIndex={-1} className={classNameFunction(classes.root, className)} onClick={onClick}>{children}</button>
);

export const Button = injectSheet(styles)(RawButton);
