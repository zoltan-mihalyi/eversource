import { NetworkingContext, NetworkingState } from './NetworkingState';
import { LoadingCharactersState } from './LoadingCharactersState';
import { GameApplication } from '../map/GameApplication';
import { StateManager } from '../../../common/util/StateManager';
import { cleanupTextures } from '../utils';
import { Diff } from '../../../common/protocol/Diff';
import { Position } from '../../../common/domain/Location';
import { GameScreen } from '../components/game/GameScreen';
import { LoadedMap } from '../../../common/tiled/TiledResolver';
import { Action, ChatMessage, PlayerStateDiff } from '../../../common/protocol/Messages';
import { QuestId } from '../../../common/domain/InteractionTable';
import { QuestLogItem } from '../../../common/protocol/QuestLogItem';
import { PlayerState } from '../../../common/protocol/PlayerState';
import { EntityId } from '../../../common/es/Entity';
import { NetworkComponents } from '../../../common/components/NetworkComponents';
import { Nullable } from '../../../common/util/Types';
import { ItemInfoWithCount, SlotId } from '../../../common/protocol/ItemInfo';
import { MapDiffUnpacker } from './MapDiffUnpacker';
import { EquipmentSlotId } from '../../../common/domain/CharacterInfo';
import ResourceDictionary = PIXI.loaders.ResourceDictionary;

export interface PlayingStateData {
    map: LoadedMap;
    resources: ResourceDictionary;
    position: Position;
}

export interface PlayingNetworkApi {
    leaveGame(): void;

    move(x: number, y: number): void;

    interact(id: EntityId): void;

    acceptQuest(id: QuestId): void;

    abandonQuest(id: QuestId): void;

    completeQuest(id: QuestId, selectedRewards: number[]): void;

    closeInteraction(): void;

    sendChatMessage(message: string): void;

    equip(slotId: SlotId, equipmentSlotId: EquipmentSlotId): void;

    unequip(equipmentSlotId: EquipmentSlotId): void;
}

export class PlayingState extends NetworkingState<PlayingStateData> implements PlayingNetworkApi {
    private readonly game: GameApplication;
    private gameScreen!: GameScreen;
    private currentPlayerState: PlayerState = { interaction: null, character: null };
    private questLogMap = new MapDiffUnpacker<QuestId, QuestLogItem>();
    private inventoryMap = new MapDiffUnpacker<SlotId, ItemInfoWithCount>();
    private equipmentMap = new MapDiffUnpacker<EquipmentSlotId, ItemInfoWithCount>();

    constructor(manager: StateManager<any, NetworkingContext>, context: NetworkingContext, data: PlayingStateData) {
        super(manager, context, data);
        this.game = new GameApplication(data, this);
    }

    onEnter() {
        this.context.display.showGame(this.game, (gameScreen: GameScreen) => {
            this.gameScreen = gameScreen;
        }, this);
    }

    world(diffs: Diff<EntityId, Nullable<NetworkComponents>>[]) {
        this.game.eventBus.emit('worldUpdate', diffs);
    }

    chatMessage(message: ChatMessage) {
        this.game.eventBus.emit('chatMessage', message);
        this.gameScreen.chatMessageReceived(message);
    }

    action(action: Action) {
        this.game.eventBus.emit('effectAnimationAction', action);
    }

    playerState(playerStateDiff: PlayerStateDiff) {
        this.updatePlayerState(playerStateDiff);
        this.gameScreen.updatePlayerState(this.currentPlayerState);
    }

    private updatePlayerState(playerStateDiff: PlayerStateDiff) {
        const playerState = this.currentPlayerState;

        const newPlayerState: PlayerState = { ...playerState };
        for (const key of Object.keys(playerStateDiff) as (keyof PlayerState)[]) {
            const valueDiff = playerStateDiff[key] as PlayerState[keyof PlayerState];
            let newValue: PlayerState[keyof PlayerState];
            if (valueDiff === null) {
                newValue = null;
            } else {
                if (playerState[key]) {
                    newValue = { ...playerState[key], ...valueDiff };
                } else {
                    newValue = valueDiff;
                }
            }

            newPlayerState[key] = newValue;
        }
        this.currentPlayerState = newPlayerState;
    }

    questLog(diffs: Diff<QuestId, QuestLogItem>[]) {
        this.questLogMap.update(diffs);

        this.gameScreen.updateQuestLog(this.questLogMap.getCurrent());
    }

    inventory(diffs: Diff<SlotId, ItemInfoWithCount>[]) {
        this.inventoryMap.update(diffs);
        this.gameScreen.updateInventory(this.inventoryMap.getCurrent());
    }

    equipment(diffs: Diff<EquipmentSlotId, ItemInfoWithCount>[]) {
        this.equipmentMap.update(diffs);
        this.gameScreen.updateEquipment(this.equipmentMap.getCurrent());
    }

    protected abort() {
        this.cleanup();
    }

    private cleanup() {
        this.game.destroy();
        cleanupTextures();
    }

    leaveGame() {
        this.cleanup();
        this.context.ws.send('leave');
        this.manager.enter(LoadingCharactersState, void 0)
    }

    move(x: number, y: number) {
        this.context.ws.send('command:move:' + x + ',' + y);
    }

    interact(id: EntityId) {
        this.context.ws.send(`command:interact:${id}`);
    }

    acceptQuest(id: QuestId) {
        this.context.ws.send(`command:accept-quest:${id}`);
    }

    abandonQuest(id: QuestId) {
        this.context.ws.send(`command:abandon-quest:${id}`);
    }

    completeQuest(id: QuestId, selectedRewards: number[]) {
        this.context.ws.send(`command:complete-quest:${[id, ...selectedRewards].join(',')}`);
    }

    closeInteraction() {
        this.context.ws.send(`command:interact-end`);
    }

    sendChatMessage(message: string) {
        this.context.ws.send(`command:chat-message:${message}`);
    }

    equip(slotId: SlotId, equipmentSlotId: EquipmentSlotId) {
        this.context.ws.send(`command:equip:${equipmentSlotId}:${slotId}`);
    }

    unequip(equipmentSlotId: EquipmentSlotId) {
        this.context.ws.send(`command:equip:${equipmentSlotId}`);
    }
}
