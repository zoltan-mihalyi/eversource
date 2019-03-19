import { StyleRules, WithStyles } from '../../interfaces';
import * as React from 'react';
import { forwardRef } from 'react';
import { className, injectSheet, SMALL_DEVICE } from '../../utils';
import { black, brown } from '../../theme';


type ClassKeys = 'root';

const styles: StyleRules<ClassKeys> = {
    root: {
        fontFamily: 'pixel, serif',
        border: '1px solid #85581b',
        borderColor: brown.normalDark,
        backgroundColor: brown.lighter,
        color: black,
        width: 300,
        fontSize: 24,
        paddingLeft: 4,
        paddingRight: 4,
        margin: 4,

        '&:focus': {
            outline: 0,
        },

        [SMALL_DEVICE]: {
            fontSize: 12,
            width: 150,
            paddingLeft: 2,
            paddingRight: 2,
            margin: 2,
        }
    },
};

export interface Props extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    forwardedRef?: React.Ref<HTMLInputElement>;
}

const RawInput: React.FunctionComponent<Props & WithStyles<ClassKeys>> = ({ children, classes, theme, forwardedRef, className: cName, ...rest }) => (
    <input className={className(classes.root, cName)} ref={forwardedRef} {...rest}>{children}</input>
);

const RawInputWithStyle = injectSheet(styles)(RawInput);

export const Input = forwardRef<HTMLInputElement, Props>((props, ref) => <RawInputWithStyle forwardedRef={ref} {...props}/>);
