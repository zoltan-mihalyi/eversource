import { StyleRules, WithStyles } from '../../interfaces';
import * as React from 'react';
import { injectSheet, SMALL_DEVICE } from '../../utils';
import { black, brown } from '../../theme';


type ClassKeys = 'root';

const styles: StyleRules<ClassKeys> = {
    root: {
        fontFamily: 'pixel, serif',
        border: '1px solid #85581b',
        borderColor: brown.normalDark,
        backgroundColor: brown.lighter,
        color: black,
        width: 180,
        fontSize: 24,
        paddingLeft: 4,
        paddingRight: 4,
        margin: 4,

        [SMALL_DEVICE]: {
            fontSize: 12,
            width: 90,
            paddingLeft: 2,
            paddingRight: 2,
            margin: 2,
        }
    },
};

export interface Props extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
}

const RawInput: React.FunctionComponent<Props & WithStyles<ClassKeys>> = ({ children, classes, theme, ...rest }) => (
    <input className={classes.root} {...rest}>{children}</input>
);

const classKeysWrapper = injectSheet(styles);
export const Input = classKeysWrapper(RawInput);
