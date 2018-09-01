import { ClientState } from './ClientState';
import { CharacterSelectionRequestHandler } from './CharacterSelectionRequestHandler';

export class InitialClientState extends ClientState<void> {
    characters() {
        const characters = this.handlerManager.dao.getCharacters();

        this.handlerManager.sendMessage('characters', characters);
        this.handlerManager.enterState(CharacterSelectionRequestHandler, void 0);
    }
}