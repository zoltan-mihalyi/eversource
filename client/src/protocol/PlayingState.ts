import { NetworkingContext, NetworkingState } from './NetworkingState';
import { GameLevel } from '../map/GameLevel';
import { LoadingCharactersState } from './LoadingCharactersState';
import { GameApplication } from '../map/GameApplication';
import { StateManager } from '../../../common/util/StateManager';
import { cleanupTextures } from '../utils';
import { Diff } from '../../../common/protocol/Diff';
import { Position } from '../../../common/domain/Location';
import { GameScreen } from '../components/game/GameScreen';

interface PlayingStateData {
    gameLevel: GameLevel;
    position: Position;
}

export interface PlayingNetworkApi {
    leaveGame(): void;

    move(x: number, y: number): void;
}

export class PlayingState extends NetworkingState<PlayingStateData> implements PlayingNetworkApi {
    private readonly game: GameApplication;
    private gameScreen!: GameScreen;

    constructor(manager: StateManager<any, NetworkingContext>, context: NetworkingContext, data: PlayingStateData) {
        super(manager, context, data);
        const { gameLevel, position } = data;
        this.game = new GameApplication(gameLevel, position, this);
    }

    onEnter() {
        this.context.display.showGame(this.game, (gameScreen: GameScreen) => {
            this.gameScreen = gameScreen;
        }, this);
    }

    diffs(diffs: Diff[]) {
        this.game.updateState(diffs);
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
}
