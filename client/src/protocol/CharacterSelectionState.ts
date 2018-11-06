import { NetworkingState } from './NetworkingState';
import { CharacterInfo } from '../../../common/domain/CharacterInfo';
import { LoadingState } from './LoadingState';

export class CharacterSelectionState extends NetworkingState<CharacterInfo[]> {

    onEnter() {
        this.context.display.showCharacterSelection(this.data, this.selectCharacter, this.onExit);
    }

    private selectCharacter = (character: CharacterInfo) => {
        const { id, location } = character;

        this.context.connection.send(`enter:${id}`);

        this.manager.enter(LoadingState, location);
    };

    private onExit = () => {
        this.context.display.showLogin();
        this.context.closeConnection();
    };
}