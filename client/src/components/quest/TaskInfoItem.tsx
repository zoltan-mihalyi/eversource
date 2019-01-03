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
    if (status !== null) {
        return (
            <span className={status === task.count ? classes.completed : void 0}>
                {task.title} ({status}/{task.count})
            </span>
        );
    } else {
        return (
            <>
                {task.count !== 1 ? task.count + ' ' : ''}{task.title}
            </>
        );
    }
};

export const TaskInfoItem = injectSheet(styles)(RawTaskInfoItem);
