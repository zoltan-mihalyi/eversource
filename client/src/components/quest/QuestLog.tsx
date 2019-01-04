import * as React from 'react';
import { QuestId } from '../../../../common/domain/InteractionTable';
import { QuestLogItem } from '../../../../common/protocol/QuestLogItem';
import { Dialog } from '../common/Dialog';
import { List } from '../common/List';
import { Scrollable } from '../common/Scrollable';
import { Level, ListItem } from '../common/List/ListItem';
import { SplitLayout } from '../common/SplitLayout';
import { QuestContent } from './QuestContent';

interface Props {
    playerLevel: number;
    questLog: Map<QuestId, QuestLogItem>;
    onClose: () => void;
}

interface State {
    selected?: QuestId;
}

export class QuestLog extends React.PureComponent<Props, State> {
    state: State = {};

    render() {
        const { playerLevel, questLog } = this.props;
        const selected = this.state.selected || questLog.keys().next().value;
        const item = (selected && questLog.get(selected)) || null;

        return (
            <Dialog title="Quest Log" onClose={this.props.onClose}>
                <SplitLayout>
                    <Scrollable>
                        <List>
                            {Array.from(questLog).map(([key, item]) => (
                                <ListItem level={questLevel(playerLevel, item.info.level)} selected={selected === key} key={key}
                                          checked={isComplete(item)} onClick={() => this.select(key)}>
                                    [{item.info.level}] {item.info.name}
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

function questLevel(playerLevel: number, questLevel: number): Level {
    const diff = questLevel - playerLevel;

    if (diff > 4) {
        return 'highest';
    }
    if (diff > 2) {
        return 'higher';
    }
    if (diff >= -2) {
        return 'normal';
    }
    if (diff >= -4) {
        return 'lower';
    }
    return 'lowest';
}
