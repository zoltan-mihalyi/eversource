import * as React from 'react';
import { StyleRules, WithStyles } from '../interfaces';
import { injectSheet, SMALL_DEVICE } from '../utils';
import { Button } from './Button';
import { Panel } from './Panel';
import { brown, red } from '../theme';

type ClassKeys = 'title' | 'header' | 'closeButton';

const styles: StyleRules<ClassKeys> = {

    header: {
        display: 'flex',
        backgroundColor: red.darkest,
    },
    title: {
        flex: 1,
        display: 'inline-block',
        fontSize: 20,
        lineHeight: '26px',
        textAlign: 'center',
        color: brown.normal,
        [SMALL_DEVICE]: {
            fontSize: 16,
            lineHeight: '18px',
        }
    },
    closeButton: {
        opacity: 1,
        margin: 0,
        width: 26,
        height: 26,
        fontSize: 22,
        textAlign: 'center',
        color:  brown.lighter,
        '&:hover': {
            color: red.normal,
        },
        [SMALL_DEVICE]: {
            fontSize: 16,
            width: 18,
            height: 18,
        }
    }
};

interface Props {
    title: string;
    onClose: () => void;
}

const RawDialog: React.ComponentType<Props & WithStyles<ClassKeys>> = ({ title, classes, children, onClose }) => {
    return (
        <Panel margin>
            <div className={classes.header}>
                <span className={classes.title}>{title}</span>
                <Button className={classes.closeButton} onClick={onClose}>X</Button>
            </div>
            {children}
        </Panel>
    );
};

export const Dialog = injectSheet(styles)(RawDialog);
