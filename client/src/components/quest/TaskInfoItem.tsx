import * as React from 'react';
import { TaskInfo } from '../../../../common/domain/InteractionTable';
import { injectSheet } from '../utils';
import { StyleRules, WithStyles } from '../interfaces';

type ClassKeys = 'completed';

const styles: StyleRules<ClassKeys> = {
    completed: {
        opacity: 0.3,
    },
};

interface Props {
    task: TaskInfo;
    status: number | null;
}

const RawTaskInfoItem: React.FunctionComponent<Props & WithStyles<ClassKeys>> = ({ status, task, classes }) => {
    const { count, track } = task;
    if (!track) {
        return null;
    }

    if (status !== null) {
        return (
            <li>
                <span className={status === count ? classes.completed : void 0}>
                    {track.title} ({status}/{count})
                </span>
            </li>
        );
    } else {
        return (
            <li>
                {count !== 1 ? count + ' ' : ''}{track.title}
            </li>
        );
    }
};

export const TaskInfoItem = injectSheet(styles)(RawTaskInfoItem);
