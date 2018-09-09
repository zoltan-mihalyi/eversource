import { X, Y, ZoneId } from '../../../common/domain/Location';
import { UserDao } from '../dao/UserDao';
import { CharacterId, CharacterInfo, CharacterName, ClassId } from '../../../common/domain/CharacterInfo';

export class FakeUserDao implements UserDao {
    private characters: CharacterInfo[] = [
        {
            id: '1' as CharacterId,
            name: 'John' as CharacterName,
            classId: 'warrior' as ClassId,

            location: {
                position: {
                    x: 106 as X,
                    y: 214 as Y,
                },
                zoneId: 'lavaland' as ZoneId,
            },
        },
        {
            id: '2' as CharacterId,
            name: 'Robin' as CharacterName,
            classId: 'hunter' as ClassId,

            location: {
                position: {
                    x: 116 as X,
                    y: 164 as Y,
                },
                zoneId: 'lavaland' as ZoneId,
            },
        },
        {
            id: '3' as CharacterId,
            name: 'Unimaginable' as CharacterName,
            classId: 'mage' as ClassId,

            location: {
                position: {
                    x: 116 as X,
                    y: 164 as Y,
                },
                zoneId: 'lavaland' as ZoneId,
            },
        },
    ];

    getCharacters(): CharacterInfo[] {
        return this.characters;
    }

    getCharacterIfExists(id: string): CharacterInfo | null {
        return this.characters.find(char => char.id === id) || null;
    }
}
