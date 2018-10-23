import { NetworkingContext, NetworkingState } from './NetworkingState';
import { LoadingCharactersState } from './LoadingCharactersState';
import { GameApplication } from '../map/GameApplication';
import { StateManager } from '../../../common/util/StateManager';
import { cleanupTextures } from '../utils';
import { Diff } from '../../../common/protocol/Diff';
import { Position } from '../../../common/domain/Location';
import { GameScreen } from '../components/game/GameScreen';
import { LoadedMap } from '../../../common/tiled/TiledResolver';
import { EntityId } from '../../../common/domain/EntityData';
import { PlayerStateDiff } from '../../../common/protocol/Messages';
import { QuestId } from '../../../common/domain/InteractionTable';
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

    completeQuest(id: QuestId): void;

    closeInteraction(): void;
}

export class PlayingState extends NetworkingState<PlayingStateData> implements PlayingNetworkApi {
    private readonly game: GameApplication;
    private gameScreen!: GameScreen;

    constructor(manager: StateManager<any, NetworkingContext>, context: NetworkingContext, data: PlayingStateData) {
        super(manager, context, data);
        this.game = new GameApplication(data, this);
    }

    onEnter() {
        this.context.display.showGame(this.game, (gameScreen: GameScreen) => {
            this.gameScreen = gameScreen;
        }, this);
    }

    diffs(diffs: Diff[]) {
        this.game.updateState(diffs);
    }

    playerState(playerState: PlayerStateDiff) {
        this.gameScreen.updatePlayerState(playerState);
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

    completeQuest(id: QuestId) {
        this.context.ws.send(`command:complete-quest:${id}`);
    }

    closeInteraction() {
        this.context.ws.send(`command:interact-end`);
    }
}
