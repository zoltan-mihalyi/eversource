import { CharacterInfo } from '../../../common/domain/CharacterInfo';
import { ZoneId } from '../../../common/domain/Location';
import { GameApplication } from '../map/GameApplication';
import { GameScreen } from '../components/game/GameScreen';
import { PlayingNetworkApi } from './PlayingState';

export interface Display {
    showLogin(): void;

    showConnecting(): void;

    showCharacterLoading(): void;

    showError(message: string): void;

    showCharacterSelection(characters: CharacterInfo[], onSelect: (character: CharacterInfo) => void, onExit: () => void): void;

    showLoading(zoneId: ZoneId): void;

    showGame(game: GameApplication, onMount: (gameScreen: GameScreen) => void, playingNetworkApi: PlayingNetworkApi): void;
}
