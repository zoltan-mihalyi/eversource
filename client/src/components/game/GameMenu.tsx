import * as React from 'react';
import { QuestLog } from '../quest/QuestLog';
import { QuestId } from '../../../../common/domain/InteractionTable';
import { QuestLogItem } from '../../../../common/protocol/QuestLogItem';
import { ActionButton } from '../common/Button/ActionButton';
import { Positioned } from '../common/Positioned';
import { Inventory } from '../inventory/Inventory';
import { InventoryItemInfo } from '../../../../common/protocol/Inventory';
import { CharacterState } from '../../../../common/protocol/PlayerState';

interface Props {
    questLog: Map<QuestId, QuestLogItem>;
    character: CharacterState;
    inventory: InventoryItemInfo[];
    onLeave: () => void;
    onAbandonQuest: (questId: QuestId) => void;
}

interface State {
    current: 'questLog' | 'inventory' | null;
}

export class GameMenu extends React.PureComponent<Props, State> {
    state: State = { current: null };

    render() {
        const { questLog, character, inventory, onLeave } = this.props;
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
                    <div style={{ height: 20 }}/>
                    <div>
                        <ActionButton onClick={this.selectInventory}>Inventory</ActionButton>
                    </div>
                </>
            );
        } else if (current === 'inventory') {
            content = (
                <Inventory slots={character.inventorySize} items={inventory} onClose={this.close}/>
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

    private selectInventory = () => {
        this.setState({ current: 'inventory' });
    };

    private close = () => {
        this.setState({ current: null });
    }
}
