import { StyleRules, WithStyles } from '../interfaces';
import * as React from 'react';
import { injectSheet, SMALL_DEVICE } from '../utils';
import { black } from '../theme';


type ClassKeys = 'root';

const styles: StyleRules<ClassKeys> = {
    root: {
        '& h2': {
            marginTop: 0,
            fontSize: 32,
            color: black,
        },
        '& h3': {
            fontSize: 24,
            color: black,
        },
        '& p': {
            marginTop: 0,
        },
        [SMALL_DEVICE]: {
            '& h2': {
                fontSize: 16,
            },
            '& h3': {
                fontSize: 12,
            },
        },
    },
};

interface Props {
}

const RawQuestStyle: React.FunctionComponent<Props & WithStyles<ClassKeys>> = ({ classes, children }) => (
    <div className={classes.root}>
        {children}
    </div>
);


export const QuestStyle = injectSheet(styles)(RawQuestStyle);
