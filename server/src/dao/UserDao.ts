import { CharacterInfo } from '../../../common/domain/CharacterInfo';

export interface UserDao {
    getCharacters(): CharacterInfo[];

    getCharacterIfExists(id: string): CharacterInfo | null;
}
