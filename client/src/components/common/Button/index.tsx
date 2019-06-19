import { StyleRules, WithStyles } from '../../interfaces';
import * as React from 'react';
import { className as classNameFunction, injectSheet, SMALL_DEVICE } from '../../utils';
import { gui } from '../../../audio/AudioEngine';

type ClassKeys = 'root' | 'centerer' | 'centered';

const styles: StyleRules<ClassKeys> = {
    root: {
        display: 'inline-block',
        boxSizing: 'border-box',

        textAlign: 'center',
        border: 0,
        background: 'none',
        padding: 0,
        margin: 2,
        opacity: 0.7,
        fontSize: 24,

        [SMALL_DEVICE]: {
            fontSize: 12,
        }
    },
    centerer: {
        height: '100%',
        display: 'inline-block',
        verticalAlign: 'middle',
    },
    centered: {
        display: 'inline-block',
        verticalAlign: 'middle',
    }
};

export interface Props {
    className?: string;
    onClick: () => void;
    sound: string;
}

class RawButton extends React.Component<Props & WithStyles<ClassKeys>> {
    render() {
        const { children, classes, className } = this.props;
        return (
            <div className={classNameFunction(classes.root, className)} onClick={this.onClick}>
                <span className={classes.centerer}/>
                <span className={classes.centered}>
                    {children}
                </span>
            </div>
        );
    }

    private onClick = () => {
        const { onClick, sound } = this.props;
        gui.playSound(sound);
        onClick();
    }
}

export const Button = injectSheet(styles)(RawButton);
