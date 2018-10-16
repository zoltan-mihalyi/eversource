import { NetworkingState } from './NetworkingState';
import { CharacterInfo } from '../../../common/domain/CharacterInfo';
import { CharacterSelectionState } from './CharacterSelectionState';
import { PROTOCOL_VERSION } from '../../../common/protocol/Messages';
import { LoadingCharactersState } from './LoadingCharactersState';

export interface ConnectingData {
    username: string;
    password: string;
}

export class ConnectingState extends NetworkingState<ConnectingData> {
    onEnter() {
        this.context.display.showConnecting();
    }

    onOpen() {
        const { username, password } = this.data;

        this.context.ws.send(JSON.stringify({
            v: PROTOCOL_VERSION,
            username,
            password,
        }));
        this.manager.enter(LoadingCharactersState, void 0);
    }

    characters(characters: CharacterInfo[]) {
        this.manager.enter(CharacterSelectionState, characters);
    }
}
