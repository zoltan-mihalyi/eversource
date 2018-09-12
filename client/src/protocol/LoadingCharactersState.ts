import { NetworkingState } from './NetworkingState';
import { CharacterInfo } from '../../../common/domain/CharacterInfo';
import { CharacterSelectionState } from './CharacterSelectionState';

export class LoadingCharactersState extends NetworkingState<void> {
    characters(characters: CharacterInfo[]) {
        this.manager.enter(CharacterSelectionState, characters);
    }
}
