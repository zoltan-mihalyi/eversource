import * as React from 'react';
import { QuestInfo } from '../../../../common/domain/InteractionTable';

export const enum QuestItemState {
    ACCEPTABLE,
    COMPLETABLE
}

interface Props {
    state: QuestItemState;
    quest: QuestInfo;
    onSelect: (id: QuestInfo) => void;
}

export class QuestItem extends React.Component<Props> {
    render() {
        const { state, quest } = this.props;

        const icon = state === QuestItemState.ACCEPTABLE ? '!' : '?';

        return (
            <li>
                <button className="item" onClick={this.onSelect}>{icon} {quest.name}</button>
            </li>
        );
    }

    private onSelect = () => {
        this.props.onSelect(this.props.quest);
    };
}
