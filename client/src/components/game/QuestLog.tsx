import * as React from 'react';
import { QuestId } from '../../../../common/domain/InteractionTable';
import { QuestLogItem } from '../../../../common/protocol/QuestLogItem';

interface Props {
    questLog: Map<QuestId, QuestLogItem>;
}

export const QuestLog: React.SFC<Props> = ({ questLog }: Props) => {
    return (
        <div className="panel size-medium">
            <h2>Quest log</h2>
            <ul className="limited">
                {Array.from(questLog).map(([key, item]) => (
                    <li key={key} className={[...questClass(item), 'quest-log-item'].join(' ')}>
                        <div className="">
                            {item.info.name}

                            {item.status === 'failed' ? 'Failed' : (
                                <ul className="task-status">
                                    {item.info.tasks.map((task, i) => (
                                        <li key={i}>{task.title} ({item.status[i]} / {task.count})</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

function questClass(item: QuestLogItem): string[] {
    if (item.status === 'failed') {
        return ['failed'];
    }

    let complete = true;
    item.info.tasks.forEach((task, i) => {
        if (item.status[i] !== task.count) {
            complete = false;
        }
    });

    return complete ? ['complete'] : []
}