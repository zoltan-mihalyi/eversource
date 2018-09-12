import { ClientState } from './ClientState';
import { LoadingRequestHandler } from './LoadingRequestHandler';

export class CharacterSelectionRequestHandler extends ClientState<void> {
    onEnter() {
        const characters = this.context.dao.getCharacters();
        this.context.sendCommand('characters', characters);
    }

    enter(data: string) {
        const character = this.context.dao.getCharacterIfExists(data);
        if (!character) {
            return;
        }
        this.manager.enter(LoadingRequestHandler, character);
    }
}
