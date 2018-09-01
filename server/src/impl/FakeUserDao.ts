import { X, Y, ZoneId } from '../../../common/domain/Location';
import { UserDao } from '../dao/UserDao';
import { CharacterId, CharacterInfo, CharacterName, ClassId } from '../../../common/domain/CharacterInfo';

const characters: CharacterInfo[] = [
    {
        id: '1' as CharacterId,
        name: 'John' as CharacterName,
        classId: 'warrior' as ClassId,

        location: {
            x: 100 as X,
            y: 100 as Y,
            zoneId: 'lavaland' as ZoneId,
        },
    },
];

export class FakeUserDao implements UserDao {
    getCharacters(): CharacterInfo[] {
        return characters;
    }

    getCharacterIfExists(id: string): CharacterInfo | null {
        if (id !== '1') {
            return null;
        }
        return characters[0];
    }
}
