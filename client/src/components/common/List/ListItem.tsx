import * as React from 'react';
import { className, injectSheet } from '../../utils';
import { StyleRules, WithStyles } from '../../interfaces';
import { gui } from '../../../audio/AudioEngine';

type ClassKeys = 'root' | 'selected' | 'status';

const styles: StyleRules<ClassKeys> = {
    root: {
        '&:hover': {
            backgroundColor: 'rgba(255,220,120,0.3)'
        },
    },
    selected: {
        backgroundColor: 'rgba(255,220,120,0.2)'
    },
    status: {
        display: 'inline-block',
        width: 22,
        textAlign: 'right',
        marginRight: 3,
    },
};

export interface Props {
    selected?: boolean;
    onClick?: () => void;
}

class RawListItem extends React.Component<Props & WithStyles<ClassKeys>> {
    render() {
        const { children, classes, selected, onClick } = this.props;
        return (
            <li className={className(classes.root, selected && classes.selected)} onClick={this.onClick}>
                {children}
            </li>
        );
    }

    private onClick = () => {
        const { onClick } = this.props;
        gui.playSound('click');

        if (onClick) {
            onClick();
        }
    }
}

export const ListItem = injectSheet(styles)(RawListItem);
