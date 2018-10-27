import * as React from 'react';
import { InteractionTable, QuestId, QuestInfo } from '../../../../common/domain/InteractionTable';
import { QuestItem, QuestItemState } from './QuestItem';
import { CloseButton } from '../gui/CloseButton';

interface Props {
    interactions: InteractionTable;
    onClose: () => void;
    onAcceptQuest: (id: QuestId) => void;
    onCompleteQuest: (id: QuestId) => void;
}

interface State {
    selectedId: QuestId | null;
}

export class InteractionTableGui extends React.PureComponent<Props, State> {
    state: State = { selectedId: null };

    static getDerivedStateFromProps(props: Props, state: State): Partial<State> | null {
        const { selectedId } = state;
        if (selectedId === null) {
            return null;
        }

        const { acceptable, completable } = props.interactions;
        if (!findQuest(acceptable, selectedId) && !findQuest(completable, selectedId)) {
            return {
                selectedId: null,
            };
        }
        return null;
    }

    render() {
        const { acceptable, completable } = this.props.interactions;
        const selected = this.getSelected();

        const completed = selected !== null && completable.indexOf(selected) !== -1;
        return (
            <div className="panel size-medium">
                <CloseButton onClose={this.props.onClose}/>
                {selected ? (
                    <>
                        <h2>{selected.name}</h2>
                        <p>{completed ? selected.completion : selected.description}</p>

                        {selected.tasks.length === 0 || completed ? null : (
                            <>
                                <h3>Completion</h3>
                                <ul className="task-status">
                                    {selected.tasks.map((task, i) => (
                                        <li key={i}>{task.count !== 1 ? task.count + ' ' : ''}{task.title}</li>
                                    ))}
                                </ul>
                            </>
                        )}

                        <button className="item" onClick={this.clearSelection}>Back</button>
                        {!completed ? (
                            <button className="item" onClick={this.onAccept}>Accept</button>
                        ) : (
                            <button className="item" onClick={this.onComplete}>Complete</button>
                        )}
                    </>
                ) : (
                    <ul>
                        {acceptable.map((q, i) => <QuestItem key={i} state={QuestItemState.ACCEPTABLE} quest={q}
                                                             onSelect={this.onSelect}/>)}
                        {completable.map((q, i) => <QuestItem key={i} state={QuestItemState.COMPLETABLE} quest={q}
                                                              onSelect={this.onSelect}/>)}
                    </ul>
                )}
            </div>
        );
    }

    private getSelected(): QuestInfo | null {
        const { selectedId } = this.state;
        if (selectedId === null) {
            return null;
        }
        const { acceptable, completable } = this.props.interactions;
        return findQuest(acceptable, selectedId) || findQuest(completable, selectedId)!;
    }

    private onSelect = (quest: QuestInfo) => {
        this.setState({ selectedId: quest.id });
    };

    private clearSelection = () => {
        this.setState({ selectedId: null });
    };

    private onAccept = () => {
        this.props.onAcceptQuest(this.state.selectedId!);
    };

    private onComplete = () => {
        this.props.onCompleteQuest(this.state.selectedId!);
    };
}

function findQuest(list: QuestInfo[], questId: QuestId): QuestInfo | undefined {
    return list.find(item => item.id === questId);
}