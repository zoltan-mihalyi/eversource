import { CharacterInfo } from '../../../common/domain/CharacterInfo';
import { CharacterDetails } from '../character/CharacterDetails';

export interface UserDao {
    getCharacters(): CharacterInfo[];

    getCharacterIfExists(id: string): CharacterDetails | null;
}
