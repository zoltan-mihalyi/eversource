import { ClientState } from './ClientState';
import { CharacterSelectionRequestHandler } from './CharacterSelectionRequestHandler';

export class InitialClientState extends ClientState<void> {
    characters() {
        const characters = this.context.dao.getCharacters();

        this.context.sendMessage('characters', characters);
        this.manager.enter(CharacterSelectionRequestHandler, void 0);
    }
}