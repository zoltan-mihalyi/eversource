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
            appearance: {
                sex: 'male',
                body: ['dark'],
                hair: ['messy1'],
                ears: [],
                eyes: ['red'],
                nose: ['bignose'],
            },
            equipment: {
                shirt: ['white'],
                head: ['bandana'],
                chest: [],
                legs: ['pants'],
                feet: ['shoes', 'black'],
            },
        },
        {
            id: '2' as CharacterId,
            name: 'Robin' as CharacterName,
            classId: 'hunter' as ClassId,

            location: {
                position: {
                    x: 101 as X,
                    y: 214 as Y,
                },
                zoneId: 'lavaland' as ZoneId,
            },
            appearance: {
                sex: 'male',
                body: ['light'],
                hair: ['bedhead'],
                ears: [],
                eyes: [],
                nose: ['straightnose'],
            },
            equipment: {
                shirt: [],
                head: ['golden_helm'],
                chest: ['golden_chest'],
                legs: ['golden_greaves'],
                feet: ['golden_boots'],
            },
        },
        {
            id: '3' as CharacterId,
            name: 'Unimaginable' as CharacterName,
            classId: 'mage' as ClassId,

            location: {
                position: {
                    x: 106 as X,
                    y: 210 as Y,
                },
                zoneId: 'lavaland' as ZoneId,
            },
            appearance: {
                sex: 'female',
                body: ['light'],
                hair: ['xlongknot'],
                ears: ['elvenears'],
                eyes: ['blue'],
                nose: ['buttonnose'],
            },
            equipment: {
                shirt: [],
                head: ['chain_hood'],
                chest: ['mail'],
                legs: [],
                feet: ['shoes', 'maroon'],
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
