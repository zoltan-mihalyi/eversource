import * as React from 'react';
import { QuestId } from '../../../../common/domain/InteractionTable';
import { QuestLogItem } from '../../../../common/protocol/QuestLogItem';
import { Dialog } from '../common/Dialog';
import { List } from '../common/List';
import { Scrollable } from '../common/Scrollable';
import { Level, ListItem } from '../common/List/ListItem';
import { SplitLayout } from '../common/SplitLayout';
import { QuestContent } from './QuestContent';
import { ActionButton } from '../common/Button/ActionButton';
import { Panel } from '../common/Panel';
import CharacterContext from '../context/CharacterContext';
import { TextListItem } from '../common/List/TextListItem';

interface Props {
    questLog: Map<QuestId, QuestLogItem>;
    onClose: () => void;
    onAbandonQuest: (questId: QuestId) => void;
}

interface State {
    selected: QuestId | null;
}

export class QuestLog extends React.PureComponent<Props, State> {
    state: State = {
        selected: null,
    };

    static getDerivedStateFromProps(nextProps: Readonly<Props>, prevState: State): State | null {
        let selected = prevState.selected;
        if (selected !== null && !nextProps.questLog.has(selected)) { //remove invalid selection
            selected = null;
        }
        if (selected === null) {
            selected = nextProps.questLog.keys().next().value || null;
        }
        if (selected === prevState.selected) {
            return null;
        }
        return {
            selected
        };
    }

    render() {
        const { questLog } = this.props;
        const { selected } = this.state;
        const selectedItem = selected && questLog.get(selected)!;

        return (
            <Dialog title="Quest Log" onClose={this.props.onClose}>
                <SplitLayout>
                    <Scrollable>
                        <List>
                            <CharacterContext.Consumer>
                                {(character) => Array.from(questLog).map(([key, item]) => (
                                    <TextListItem level={questLevel(character.level, item.info.level)} selected={selected === key} key={key}
                                              checked={isComplete(item)} onClick={() => this.select(key)}>
                                        [{item.info.level}] {item.info.name}
                                    </TextListItem>
                                ))}
                            </CharacterContext.Consumer>
                        </List>
                    </Scrollable>
                    <Panel>
                        <Scrollable variant="paper" padding fixedHeight>
                            {
                                selectedItem === null ? 'No quest selected' :
                                    <QuestContent status={selectedItem.status} info={selectedItem.info}/>
                            }
                        </Scrollable>

                        {selectedItem !== null && <ActionButton onClick={this.abandon}>Abandon</ActionButton>}
                    </Panel>
                </SplitLayout>
            </Dialog>
        );
    }

    private select(questId: QuestId) {
        this.setState({ selected: questId });
    }

    private abandon = () => {
        this.props.onAbandonQuest(this.state.selected!);
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
