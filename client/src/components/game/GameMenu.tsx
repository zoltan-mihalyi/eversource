import * as React from 'react';
import { QuestLog } from '../quest/QuestLog';
import { QuestId } from '../../../../common/domain/InteractionTable';
import { QuestLogItem } from '../../../../common/protocol/QuestLogItem';
import { ActionButton } from '../common/Button/ActionButton';
import { Positioned } from '../common/Positioned';
import { Inventory } from '../inventory/Inventory';
import { ItemInfoWithCount } from '../../../../common/protocol/ItemInfo';
import { CharacterState } from '../../../../common/protocol/PlayerState';
import { injectSheet, SMALL_DEVICE } from '../utils';
import { StyleRules, WithStyles } from '../interfaces';
import { EquipmentDialog } from '../equipment/EquipmentDialog';
import { EquipmentSlotId } from '../../../../common/domain/CharacterInfo';
import { ItemInfo } from '../../../../common/protocol/ItemInfo';

type ClassKeys = 'first' | 'margin';

const styles: StyleRules<ClassKeys> = {
    first: {
        marginTop: 40,
    },
    margin: {
        marginTop: 20,

        [SMALL_DEVICE]: {
            marginTop: 10,
        },
    },
};

interface Props {
    questLog: Map<QuestId, QuestLogItem>;
    character: CharacterState;
    inventory: ItemInfoWithCount[];
    equipment: Map<EquipmentSlotId, ItemInfoWithCount>;
    onLeave: () => void;
    onAbandonQuest: (questId: QuestId) => void;
}

interface State {
    current: 'questLog' | 'inventory' | 'equipment' | null;
}

class RawGameMenu extends React.PureComponent<Props & WithStyles<ClassKeys>, State> {
    state: State = { current: null };

    render() {
        const { classes, questLog, character, inventory, equipment, onLeave } = this.props;
        const { current } = this.state;

        let content;
        if (current === null) {
            content = (
                <>
                    <div className={classes.first}>
                        <ActionButton onClick={onLeave}>Leave</ActionButton>
                    </div>
                    <div className={classes.margin}>
                        <ActionButton onClick={this.selectQuestLog}>Quest Log</ActionButton>
                    </div>
                    <div className={classes.margin}>
                        <ActionButton onClick={this.selectInventory}>Inventory</ActionButton>
                    </div>
                    <div className={classes.margin}>
                        <ActionButton onClick={this.selectEquipment}>Equipment</ActionButton>
                    </div>
                </>
            );
        } else if (current === 'inventory') {
            content = (
                <Inventory slots={character.inventorySize} items={inventory} onClose={this.close}/>
            );
        } else if (current === 'equipment') {
            content = (
                <EquipmentDialog equipment={equipment} onClose={this.close}/>
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

    private selectEquipment = () => {
        this.setState({ current: 'equipment' });
    };

    private close = () => {
        this.setState({ current: null });
    }
}

export const GameMenu = injectSheet(styles)(RawGameMenu);
