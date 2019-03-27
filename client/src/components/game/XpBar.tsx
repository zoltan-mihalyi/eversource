import * as React from 'react';
import { injectSheet } from '../utils';
import { StyleRules, WithStyles } from '../interfaces';
import { brown, xp } from '../theme';

type ClassKeys = 'root' | 'current' | 'level' | 'text';

const styles: StyleRules<ClassKeys> = {
    root: {
        width: '100%',
        position: 'relative',
        color: brown.lightest,
        backgroundColor: xp.background,
        borderWidth: 2,
        borderStyle: 'solid',
        borderColor: brown.darkest,
        textAlign: 'center',
        boxSizing: 'border-box',
    },
    current: {
        position: 'absolute',
        height: '100%',
        top: 0,
        backgroundImage: `linear-gradient(${xp.bright}, ${xp.foreground})`,
    },
    level: {
        position: 'absolute',
    },
    text: {
        position: 'relative',
    },
};

interface Props {
    level: number;
    xp: number;
    maxXp: number;
}

const RawXpBar: React.FunctionComponent<Props & WithStyles<ClassKeys>> = ({ classes, level, xp, maxXp }) => (
    <div className={classes.root}>
        <div className={classes.current} style={{ width: (xp / maxXp * 100) + '%' }}/>
        <div className={classes.level}>Level: {level}</div>
        <div className={classes.text}>{xp}/{maxXp}</div>
    </div>
);

export const XpBar = injectSheet(styles)(RawXpBar);
