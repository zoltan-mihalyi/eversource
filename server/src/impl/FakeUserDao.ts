import { X, Y, ZoneId } from '../../../common/domain/Location';
import { UserDao } from '../dao/UserDao';
import { CharacterId, CharacterInfo, CharacterName, ClassId } from '../../../common/domain/CharacterInfo';
import { CharacterDetails } from '../character/CharacterDetails';
import { hpForLevel } from '../../../common/algorithms';

export class FakeUserDao implements UserDao {
    private characters: CharacterDetails[] = [
        {
            questsDone: new Set(),
            questLog: new Map(),
            info:
                {
                    id: '1' as CharacterId,
                    level: 21,
                    xp: 180,
                    name: 'John' as CharacterName,
                    sex: 'male',
                    classId: 'warrior',
                    hp: hpForLevel(21),

                    location: {
                        position: {
                            x: 106 as X,
                            y: 165 as Y,
                        },
                        zoneId: 'lavaland' as ZoneId,
                    },
                    appearance: {
                        sex: 'male',
                        body: ['normal', 'dark'],
                        facial: [],
                        hair: ['messy1'],
                        ears: [],
                        eyes: ['normal', 'red'],
                        nose: ['bignose'],
                    },
                    equipment: {
                        shirt: ['long_sleeve', 'white'],
                        head: ['bandana'],
                        cape: [],
                        belt: ['cloth'],
                        arms: [],
                        chest: [],
                        legs: ['pants'],
                        hands: [],
                        feet: ['shoes', 'black'],
                        mask: ['sunglasses'],
                    },
                },
        },
        {
            questsDone: new Set(),
            questLog: new Map(),
            info: {
                id: '2' as CharacterId,
                level: 2,
                xp: 280,
                name: 'Robin' as CharacterName,
                sex: 'male',
                classId: 'hunter',
                hp: hpForLevel(2) * 0.3,

                location: {
                    position: {
                        x: 101 as X,
                        y: 214 as Y,
                    },
                    zoneId: 'lavaland' as ZoneId,
                },
                appearance: {
                    sex: 'male',
                    body: ['normal'],
                    facial: [],
                    hair: ['bedhead'],
                    ears: [],
                    eyes: [],
                    nose: ['straightnose'],
                },
                equipment: {
                    shirt: [],
                    head: ['ornate_metal_helm', 'gold'],
                    cape: ['normal', 'red'],
                    belt: [],
                    arms: ['plate', 'gold'],
                    chest: ['plate', 'gold'],
                    legs: ['plate', 'gold'],
                    hands: ['gloves', 'gold'],
                    feet: ['plate', 'gold'],
                    mask: [],
                },
            },
        },
        {
            questsDone: new Set(),
            questLog: new Map(),
            info: {
                id: '3' as CharacterId,
                level: 10,
                xp: 730,
                name: 'Unimaginable' as CharacterName,
                sex: 'female',
                classId: 'mage',
                hp: hpForLevel(10),

                location: {
                    position: {
                        x: 41 as X,
                        y: 210 as Y,
                    },
                    zoneId: 'lavaland' as ZoneId,
                },
                appearance: {
                    sex: 'female',
                    body: ['normal'],
                    facial: [],
                    hair: ['xlongknot'],
                    ears: ['elvenears'],
                    eyes: ['normal'],
                    nose: ['buttonnose'],
                },
                equipment: {
                    shirt: [],
                    head: ['chain_hood'],
                    cape: ['normal'],
                    belt: [],
                    arms: [],
                    chest: ['mail'],
                    legs: [],
                    hands: [],
                    feet: ['shoes', 'maroon'],
                    mask: [],
                },
            },
        },
    ];

    getCharacters(): CharacterInfo[] {
        return this.characters.map(character => character.info);
    }

    getCharacterIfExists(id: string): CharacterDetails | null {
        return this.characters.find(char => char.info.id === id) || null;
    }
}
