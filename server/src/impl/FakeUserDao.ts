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
                        hair: ['messy1', 'brown'],
                        ears: [],
                        eyes: ['normal', 'red'],
                        nose: ['bignose'],
                    },
                    equipment: map({
                        shirt: { itemId: 400 as ItemId, count: 1 },
                        head: { itemId: 204 as ItemId, count: 1 },
                        belt: { itemId: 500 as ItemId, count: 1 },
                        legs: { itemId: 800 as ItemId, count: 1 },
                        feet: { itemId: 702 as ItemId, count: 1 },
                    }),
                },
        },
        {
            questsDone: new Set(),
            questLog: new Map(),
            items: [
                inventoryItem(1, 1),
                inventoryItem(2),
                inventoryItem(3, 11),
                ...[204, 202, 300, 401, 601, 1000, 900, 850, 750].map((count) => inventoryItem(count))],
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
                    hair: ['bedhead', 'white-blonde'],
                    ears: [],
                    eyes: [],
                    nose: ['straightnose'],
                },
                equipment: map({
                    head: { itemId: 250 as ItemId, count: 1 },
                    cape: { itemId: 301 as ItemId, count: 1 },
                    arms: { itemId: 903 as ItemId, count: 1 },
                    chest: { itemId: 603 as ItemId, count: 1 },
                    legs: { itemId: 853 as ItemId, count: 1 },
                    hands: { itemId: 1003 as ItemId, count: 1 },
                    feet: { itemId: 753 as ItemId, count: 1 },
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
                    hair: ['xlongknot', 'redhead'],
                    ears: ['elvenears'],
                    eyes: ['normal'],
                    nose: ['buttonnose'],
                },
                equipment: map({
                    head: { itemId: 203 as ItemId, count: 1 },
                    cape: { itemId: 300 as ItemId, count: 1 },
                    chest: { itemId: 620 as ItemId, count: 1 },
                    feet: { itemId: 701 as ItemId, count: 1 },
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
