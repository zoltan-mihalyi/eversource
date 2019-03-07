import { NetworkingContext, NetworkingState } from './NetworkingState';
import { LoadingCharactersState } from './LoadingCharactersState';
import { GameApplication } from '../map/GameApplication';
import { StateManager } from '../../../common/util/StateManager';
import { cleanupTextures } from '../utils';
import { Diff } from '../../../common/protocol/Diff';
import { Position } from '../../../common/domain/Location';
import { GameScreen } from '../components/game/GameScreen';
import { LoadedMap } from '../../../common/tiled/TiledResolver';
import { ChatMessage, PlayerStateDiff } from '../../../common/protocol/Messages';
import { QuestId } from '../../../common/domain/InteractionTable';
import { QuestLogItem } from '../../../common/protocol/QuestLogItem';
import { PlayerState } from '../../../common/protocol/PlayerState';
import { EntityId } from '../../../common/es/Entity';
import { NetworkComponents } from '../../../common/components/NetworkComponents';
import { Nullable } from '../../../common/util/Types';
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

    completeQuest(id: QuestId): void;

    closeInteraction(): void;

    sendChatMessage(message: string): void;
}

export class PlayingState extends NetworkingState<PlayingStateData> implements PlayingNetworkApi {
    private readonly game: GameApplication;
    private gameScreen!: GameScreen;
    private currentPlayerState: PlayerState = { interaction: null, character: null };
    private currentQuestLog: Map<QuestId, QuestLogItem> = new Map<QuestId, QuestLogItem>();

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
        const questLog = new Map(this.currentQuestLog);

        for (const diff of diffs) {
            switch (diff.type) {
                case 'create':
                    questLog.set(diff.id, diff.data);
                    break;
                case 'change':
                    questLog.set(diff.id, { ...questLog.get(diff.id)!, ...diff.changes });
                    break;
                case 'remove':
                    questLog.delete(diff.id);
            }
        }

        this.currentQuestLog = questLog;
        this.gameScreen.updateQuestLog(questLog);
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

    completeQuest(id: QuestId) {
        this.context.ws.send(`command:complete-quest:${id}`);
    }

    closeInteraction() {
        this.context.ws.send(`command:interact-end`);
    }

    sendChatMessage(message: string) {
        this.context.ws.send(`command:chat-message:${message}`);
    }
}
