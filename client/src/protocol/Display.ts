import { CharacterInfo } from '../../../common/domain/CharacterInfo';
import { ZoneId } from '../../../common/domain/Location';
import { GameApplication } from '../map/GameApplication';

export interface Display {
    showLogin(): void;

    showCharacterLoading(): void;

    showConnectionError(message: string): void;

    showCharacterSelection(characters: CharacterInfo[], onSelect: (character: CharacterInfo) => void, onExit: () => void): void;

    showLoading(zoneId: ZoneId): void;

    showGame(game: GameApplication, enterCharacterSelection: () => void): void;
}
