import * as React from 'react';
import { StyleRules, WithStyles } from '../../interfaces';
import { className, injectSheet } from '../../utils';

export type ClassKeys = 'root' | 'hide';

const styles: StyleRules<ClassKeys> = {
    root: {
        textAlign: 'center',
        pointerEvents: 'none !important' as any,
    },
    hide: {
        opacity: 0,
        transition: 'opacity 0.5s linear',
    },
};

export interface Notification {
    readonly id: number;
    readonly content: React.ReactNode;
    readonly expiresAt: number;
    readonly hide: boolean;
}

interface Props {
    notification: Notification;
}

const RawNotificationItem: React.FunctionComponent<Props & WithStyles<ClassKeys>> = ({ notification, classes }) => (
    <div className={className(classes.root, notification.hide && classes.hide)}>{notification.content}</div>

);

export const NotificationItem = injectSheet(styles)(RawNotificationItem);
