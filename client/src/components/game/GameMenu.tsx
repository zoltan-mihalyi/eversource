import * as React from 'react';
import { QuestLog } from '../quest/QuestLog';
import { QuestId } from '../../../../common/domain/InteractionTable';
import { QuestLogItem } from '../../../../common/protocol/QuestLogItem';
import { ActionButton } from '../common/Button/ActionButton';
import { Positioned } from '../common/Positioned';

interface Props {
    questLog: Map<QuestId, QuestLogItem>;
    onLeave: () => void;
}

interface State {
    current: 'questLog' | null;
}

export class GameMenu extends React.PureComponent<Props, State> {
    state: State = { current: null };

    render() {
        const { current } = this.state;

        let content;
        if (current === null) {
            content = (
                <>
                    <div>
                        <ActionButton onClick={this.props.onLeave}>Leave</ActionButton>
                    </div>
                    <div style={{ height: 20 }}/>
                    <div>
                        <ActionButton onClick={this.selectQuestLog}>Quest Log</ActionButton>
                    </div>
                </>
            );
        } else {
            content = (
                <QuestLog questLog={this.props.questLog} onClose={this.close}/>
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