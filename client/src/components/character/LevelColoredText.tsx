import { StyleRules, WithStyles } from '../interfaces';
import { level } from '../theme';
import { Level } from '../common/List/TextListItem';
import * as React from 'react';
import { injectSheet } from '../utils';

export type Level = 'lowest' | 'lower' | 'normal' | 'higher' | 'highest';

type ClassKeys = Level;

const styles: StyleRules<ClassKeys> = {
    lowest: {
        color: level.lowest,
    },
    lower: {
        color: level.lower,
    },
    normal: {
        color: level.normal,
    },
    higher: {
        color: level.higher,
    },
    highest: {
        color: level.highest,
    },
};

interface Props {
    level: Level;
}

const RawLevelColoredText: React.FunctionComponent<Props & WithStyles<ClassKeys>> = ({ level, classes, children }) => (
    <span className={classes[level]}>{children}</span>
);

export const LevelColoredText = injectSheet(styles)(RawLevelColoredText);
