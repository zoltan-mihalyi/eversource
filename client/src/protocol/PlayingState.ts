import { NetworkingContext, NetworkingState } from './NetworkingState';
import { GameLevel } from '../map/GameLevel';
import { CharacterSelectionState } from './CharacterSelectionState';
import { LoadingCharactersState } from './LoadingCharactersState';
import { GameApplication } from '../map/GameApplication';
import { Position } from '../../../common/GameObject';
import { StateManager } from '../../../common/util/StateManager';
import { cleanupTextures } from '../utils';
import { Diff } from '../../../common/protocol/Diff';

interface PlayingStateData {
    gameLevel: GameLevel;
    position: Position;
}

export class PlayingState extends NetworkingState<PlayingStateData> {
    private readonly game: GameApplication;

    constructor(manager: StateManager<any, NetworkingContext>, context: NetworkingContext, data: PlayingStateData) {
        super(manager, context, data);
        const { gameLevel, position } = data;
        this.game = new GameApplication(gameLevel, position, this.context.ws);
    }

    onEnter() {
        this.context.display.showGame(this.game, this.enterCharacterSelection);
    }

    diffs(diffs: Diff[]) {
        this.game.updateState(diffs);
    }

    protected abort() {
        this.cleanup();
    }

    private cleanup(){
        this.game.destroy();
        cleanupTextures();
    }

    private enterCharacterSelection = () => {
        this.cleanup();
        this.context.ws.send('leave');
        this.manager.enter(LoadingCharactersState, void 0)
    };
}
