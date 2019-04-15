import * as React from 'react';
import { StyleRules, WithStyles } from '../../interfaces';
import { injectSheet, SMALL_DEVICE } from '../../utils';
import { black } from '../../theme';

type ClassKeys = 'root';

const styles: StyleRules<ClassKeys> = {
    root: {
        fontSize: 24,
        textShadow: `0 0 3px ${black}, 0 0 2px ${black}`,

        [SMALL_DEVICE]: {
            fontSize: 16,
        }
    }
};

interface Props {
    color: string;
}

const RawNotificationText: React.FunctionComponent<Props & WithStyles<ClassKeys>> = ({ color, children, classes }) => (
    <span className={classes.root} style={{ color: color }}>{children}</span>
);

export const NotificationText = injectSheet(styles)(RawNotificationText);
