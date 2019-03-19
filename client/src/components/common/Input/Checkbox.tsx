import { StyleRules, WithStyles } from '../../interfaces';
import * as React from 'react';
import { injectSheet, SMALL_DEVICE } from '../../utils';
import { brown, disabled } from '../../theme';


type ClassKeys = 'root';

const styles: StyleRules<ClassKeys> = {
    root: {
        appearance: 'none',
        width: 20,
        height: 20,
        verticalAlign: 'top',
        marginTop: 0,
        marginRight: 10,

        '&:before': {
            verticalAlign: 'top',
            display: 'inline-block',
            content: '""',
            width: 20,
            height: 20,
            borderStyle: 'solid',
            borderWidth: 1,
            color: brown.lighter,
            borderColor: brown.lighter,
            fontSize: 20,
            lineHeight: '24px',
            textAlign: 'center',
        },

        '&:checked:before': {
            content: '"✓"',
        },

        '&:hover:before': {
            backgroundColor: brown.normalDark
        },

        '&:disabled:before': {
            backgroundColor: disabled,
        },

        '&:focus': {
            outline: 0,
        },

        [SMALL_DEVICE]: {
            width: 10,
            '&:before': {
                width: 10,
                height: 10,
                fontSize: 10,
                lineHeight: '12px',
            }
        }
    },
};

export interface Props {
    checked: boolean;
    disabled?: boolean;
    label: string;
    onChange: (checked: boolean) => void;
}

class RawCheckbox extends React.Component<Props & WithStyles<ClassKeys>> {
    render() {
        const { classes, checked, disabled, label } = this.props;
        return (
            <label>
                <input type="checkbox" checked={checked} disabled={disabled} onChange={this.onChange} className={classes.root}/>
                {label}
            </label>
        );
    }

    private onChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
        this.props.onChange(e.currentTarget.checked);
    };
}

export const Checkbox = injectSheet(styles)(RawCheckbox);
