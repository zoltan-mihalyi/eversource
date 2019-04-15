import * as React from 'react';
import { InteractionTable, QuestId, QuestInfo } from '../../../../common/domain/InteractionTable';
import { InteractionItem } from './InteractionItem';
import { QuestInteractionTable } from './QuestInteractionTable';
import { QuestItemState } from './QuestItemState';
import { Dialog } from '../common/Dialog';
import { Scrollable } from '../common/Scrollable';
import { InteractionItemList } from './InteractionItemList';
import { Positioned } from '../common/Positioned';
import { ResolvedText } from './ResolvedText';
import { QuestStyle } from './QuestStyle';

interface Props {
    interactions: InteractionTable;
    onClose: () => void;
    onAcceptQuest: (id: QuestId) => void;
    onCompleteQuest: (id: QuestId) => void;
}

interface State {
    selectedId: QuestId | null;
    selectedLater: boolean;
}

export class InteractionDialog extends React.PureComponent<Props, State> {
    state: State = { selectedId: null, selectedLater: false };

    static getDerivedStateFromProps(props: Props, state: State): Partial<State> | null {
        const { selectedId } = state;
        if (selectedId === null) {
            return null;
        }

        const questInfo = findQuest(props.interactions, selectedId);
        if (!questInfo) {
            return {
                selectedId: null,
            };
        }

        // selected quest become 'later'
        if (!state.selectedLater && props.interactions.completableLater.indexOf(questInfo) !== -1) {
            return {
                selectedId: null,
            }
        }
        return null;
    }

    render() {
        const { interactions } = this.props;
        const { name, story, acceptable, completable, completableLater } = interactions;
        const { selectedId } = this.state;
        const selected = selectedId === null ? null : findQuest(interactions, selectedId)!;

        return (
            <Positioned horizontal="left" vertical="top">
                <Dialog title={name} onClose={this.props.onClose}>
                    {selected ? (
                        <QuestInteractionTable info={selected} state={getQuestState(interactions, selected)}
                                               onAccept={this.onAccept} onComplete={this.onComplete}
                                               onBack={this.clearSelection}/>
                    ) : (
                        <Scrollable fixedHeight padding variant="paper">
                            <QuestStyle>
                                <ResolvedText text={story}/>
                                <InteractionItemList>
                                    {acceptable.map((q, i) => <InteractionItem key={i} state={QuestItemState.ACCEPTABLE} quest={q}
                                                                               onSelect={this.onSelect}/>)}
                                    {completable.map((q, i) => <InteractionItem key={i} state={QuestItemState.COMPLETABLE} quest={q}
                                                                                onSelect={this.onSelect}/>)}
                                    {completableLater.map((q, i) => <InteractionItem key={i} state={QuestItemState.COMPLETABLE_LATER}
                                                                                     quest={q}
                                                                                     onSelect={this.onSelect}/>)}
                                </InteractionItemList>
                            </QuestStyle>
                        </Scrollable>
                    )}
                </Dialog>
            </Positioned>
        );
    }

    private onSelect = (quest: QuestInfo) => {
        const selectedLater = this.props.interactions.completableLater.indexOf(quest) !== -1;
        this.setState({ selectedId: quest.id, selectedLater });
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

function getQuestState(interactions: InteractionTable, quest: QuestInfo): QuestItemState {
    if (interactions.acceptable.indexOf(quest) !== -1) {
        return QuestItemState.ACCEPTABLE;
    } else if (interactions.completable.indexOf(quest) !== -1) {
        return QuestItemState.COMPLETABLE;
    } else {
        return QuestItemState.COMPLETABLE_LATER;
    }
}

function findQuest(interactions: InteractionTable, questId: QuestId): QuestInfo | undefined {
    const list = [
        ...interactions.acceptable,
        ...interactions.completable,
        ...interactions.completableLater,
    ];

    return list.find(item => item.id === questId);
}
