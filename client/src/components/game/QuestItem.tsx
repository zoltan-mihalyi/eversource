import * as React from 'react';
import { QuestInfo } from '../../../../common/domain/InteractionTable';
import { QuestItemState } from './QuestItemState';

interface Props {
    state: QuestItemState;
    quest: QuestInfo;
    onSelect: (id: QuestInfo) => void;
}


const QuestItemIcon: React.SFC<{ state: QuestItemState }> = ({ state }) => {
    switch (state) {
        case QuestItemState.ACCEPTABLE:
            return (
                <span className="quest-icon-acceptable">! </span>
            );
        case QuestItemState.COMPLETABLE:
            return (
                <span className="quest-icon-completable">? </span>
            );
        case QuestItemState.COMPLETABLE_LATER:
            return (
                <span className="quest-icon-completable-later">? </span>
            );
    }
};

export class QuestItem extends React.Component<Props> {
    render() {
        const { state, quest } = this.props;

        return (
            <li>
                <button className="item" onClick={this.onSelect}>
                    <QuestItemIcon state={state}/>
                    {quest.name}
                </button>
            </li>
        );
    }

    private onSelect = () => {
        this.props.onSelect(this.props.quest);
    };
}
