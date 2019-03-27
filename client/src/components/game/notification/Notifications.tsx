import * as React from 'react';
import { Notification, NotificationItem } from './NotificationItem';
import { times } from '../../utils';


interface Props {
    maxRows: number;
    timeInMs: number;
}


interface State {
    notifications: Notification[];
}

export class Notifications extends React.PureComponent<Props, State> {
    private timeoutId: number | null = null;
    private nextId: number = 0;

    state: State = {
        notifications: times(this.props.maxRows, () => ({
            id: this.nextId++,
            hide: true,
            expiresAt: 0,
            content: 'placeholder',
        }))
    };

    render() {
        const { notifications } = this.state;
        console.log(notifications.length);

        return notifications.map(notification => (
            <NotificationItem key={notification.id} notification={notification}/>
        ));
    }

    add(content: React.ReactNode) {
        this.setState((state, props): State => {
            const notifications: Notification[] = [
                ...state.notifications,
                {
                    id: this.nextId++,
                    content,
                    hide: false,
                    expiresAt: new Date().getTime() + props.timeInMs
                }
            ];
            if (notifications.length > props.maxRows) {
                notifications.shift();
            }

            return ({
                notifications
            });
        }, () => this.updateTimer());
    }

    private updateTimer() {
        const visibleNotifications = this.getVisibleNotifications();
        if (visibleNotifications.length === 0) {
            return;
        }

        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }

        const timeout = visibleNotifications[0].expiresAt - new Date().getTime();
        this.timeoutId = window.setTimeout(this.hideExpiredNotification, timeout);
    }

    private getVisibleNotifications() {
        return this.state.notifications.filter(notification => !notification.hide);
    }

    private hideExpiredNotification = () => {
        this.timeoutId = null;

        this.setState(state => {
            const notifications = [...state.notifications];
            for (let i = 0; i < notifications.length; i++) {
                const notification = notifications[i];
                if (!notification.hide) {
                    notifications[i] = {
                        ...notification,
                        hide: true
                    };
                    break;
                }
            }

            return ({
                notifications,
            });
        }, () => {
            this.updateTimer();
        });
    };
}
