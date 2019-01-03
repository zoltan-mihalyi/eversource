import * as React from 'react';
import { QuestId } from '../../../../common/domain/InteractionTable';
import { QuestLogItem } from '../../../../common/protocol/QuestLogItem';
import { Dialog } from '../common/Dialog';
import { List } from '../common/List';
import { Scrollable } from '../common/Scrollable';
import { ListItem } from '../common/List/ListItem';
import { SplitLayout } from '../common/SplitLayout';
import { QuestContent } from './QuestContent';

interface Props {
    questLog: Map<QuestId, QuestLogItem>;
    onClose: () => void;
}

interface State {
    selected?: QuestId;
}

export class QuestLog extends React.PureComponent<Props, State> {
    state: State = {};

    render() {
        const { questLog } = this.props;
        const selected = this.state.selected || questLog.keys().next().value;
        const item = (selected && questLog.get(selected)) || null;

        return (
            <Dialog title="Quest Log" onClose={this.props.onClose}>
                <SplitLayout>
                    <Scrollable>
                        <List>
                            {Array.from(questLog).map(([key, item]) => (
                                <ListItem selected={selected === key} key={key} checked={isComplete(item)} onClick={() => this.select(key)}>
                                    {item.info.name}
                                </ListItem>
                            ))}
                        </List>
                    </Scrollable>
                    <Scrollable variant="paper" padding fixedHeight>
                        {item ? <QuestContent status={item.status} info={item.info}/> : 'No quest'}
                    </Scrollable>
                </SplitLayout>
            </Dialog>
        );
    }

    private select(questId: QuestId) {
        this.setState({ selected: questId });
    }
}

function isComplete(item: QuestLogItem): boolean {
    let complete = true;
    item.info.tasks.forEach((task, i) => {
        if (item.status[i] !== task.count) {
            complete = false;
        }
    });
    return complete;
}
