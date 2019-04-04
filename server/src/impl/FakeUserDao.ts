import { X, Y, ZoneId } from '../../../common/domain/Location';
import { UserDao } from '../dao/UserDao';
import { CharacterId, CharacterInfo, CharacterName } from '../../../common/domain/CharacterInfo';
import { CharacterDetails } from '../character/CharacterDetails';
import { hpForLevel } from '../../../common/algorithms';
import { ItemId } from '../../../common/protocol/ItemInfo';
import { InventoryItem } from '../Item';

function inventoryItem(itemId: number, count = 1): InventoryItem {
    return {
        itemId: itemId as ItemId,
        count,
    };
}

export class FakeUserDao implements UserDao {
    private characters: CharacterDetails[] = [
        {
            questsDone: new Set(),
            questLog: new Map(),
            items: [inventoryItem(1)],
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
                    equipment: map({
                        head: { itemId: 200 as ItemId, count: 1 },
                    }),
                },
        },
        {
            questsDone: new Set(),
            questLog: new Map(),
            items: [inventoryItem(1, 1), inventoryItem(2), inventoryItem(3, 11)],
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
                equipment: map({
                    head: { itemId: 201 as ItemId, count: 1 },
                }),
            },
        },
        {
            questsDone: new Set(),
            questLog: new Map(),
            items: [inventoryItem(3)],
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
                equipment: map({
                    head: { itemId: 303 as ItemId, count: 1 },
                }),
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

function map<K extends string, V>(obj: { [P in K]: V }): Map<K, V> {
    const result = new Map<K, V>();
    for (const key of Object.keys(obj) as K[]) {
        result.set(key, obj[key]);
    }

    return result;
}
