import * as React from 'react';
import { InteractionTable, QuestId } from '../../../../common/domain/InteractionTable';
import { QuestItem, QuestItemState } from './QuestItem';
import { CloseButton } from '../gui/CloseButton';

interface Props {
    interactions: InteractionTable;
    onClose: () => void;
    onAcceptQuest: (id: QuestId) => void;
    onCompleteQuest: (id: QuestId) => void;
}

export class InteractionTableGui extends React.Component<Props> {
    render() {
        const { acceptable, completable } = this.props.interactions;

        return (
            <div className="container">
                <CloseButton onClose={this.props.onClose}/>
                <ul className="limited">
                    {acceptable.map((q, i) => <QuestItem key={i} state={QuestItemState.ACCEPTABLE} quest={q}
                                                         onSelect={this.props.onAcceptQuest}/>)}
                </ul>
                <ul className="limited">
                    {completable.map((q, i) => <QuestItem key={i} state={QuestItemState.COMPLETABLE} quest={q}
                                                          onSelect={this.props.onCompleteQuest}/>)}
                </ul>
            </div>
        );
    }
}