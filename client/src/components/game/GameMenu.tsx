import * as React from 'react';
import { QuestLog } from '../quest/QuestLog';
import { QuestId } from '../../../../common/domain/InteractionTable';
import { QuestLogItem } from '../../../../common/protocol/QuestLogItem';
import { ActionButton } from '../common/Button/ActionButton';
import { Positioned } from '../common/Positioned';

interface Props {
    questLog: Map<QuestId, QuestLogItem>;
    onLeave: () => void;
    onAbandonQuest: (questId: QuestId) => void;
}

interface State {
    current: 'questLog' | null;
}

export class GameMenu extends React.PureComponent<Props, State> {
    state: State = { current: null };

    render() {
        const { questLog, onLeave } = this.props;
        const { current } = this.state;

        let content;
        if (current === null) {
            content = (
                <>
                    <div style={{ marginTop: 40 }}>
                        <ActionButton onClick={onLeave}>Leave</ActionButton>
                    </div>
                    <div style={{ height: 20 }}/>
                    <div>
                        <ActionButton onClick={this.selectQuestLog}>Quest Log</ActionButton>
                    </div>
                </>
            );
        } else {
            content = (
                <QuestLog questLog={questLog} onClose={this.close} onAbandonQuest={this.props.onAbandonQuest}/>
            );
        }

        return (
            <Positioned horizontal="right" vertical="top">
                {content}
            </Positioned>
        );
    }

    private selectQuestLog = () => {
        this.setState({ current: 'questLog' });
    };

    private close = () => {
        this.setState({ current: null });
    }
}
