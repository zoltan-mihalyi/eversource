import { X, Y, ZoneId } from '../../../common/domain/Location';
import { UserDao } from '../dao/UserDao';
import { CharacterId, CharacterInfo, CharacterName, ClassId } from '../../../common/domain/CharacterInfo';
import { CharacterDetails } from '../character/CharacterDetails';

export class FakeUserDao implements UserDao {
    private characters: CharacterDetails[] = [
        {
            quests: new Map(),
            info:
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
                        eyes: ['normal', 'red'],
                        nose: ['bignose'],
                    },
                    equipment: {
                        shirt: ['simple', 'white'],
                        head: ['bandana'],
                        arms: [],
                        chest: [],
                        legs: ['pants'],
                        hands: [],
                        feet: ['shoes', 'black'],
                    },
                },
        },
        {
            quests: new Map(),
            info: {
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
                    head: ['ornate_metal_helm'],
                    arms: ['ornate_metal_arms'],
                    chest: ['ornate_metal_chest'],
                    legs: ['ornate_metal_greaves'],
                    hands: ['ornate_metal_gloves'],
                    feet: ['ornate_metal_boots'],
                },
            },
        },
        {
            quests: new Map(),
            info: {
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
                    eyes: ['normal'],
                    nose: ['buttonnose'],
                },
                equipment: {
                    shirt: [],
                    head: ['chain_hood'],
                    arms: [],
                    chest: ['mail'],
                    legs: [],
                    hands: [],
                    feet: ['shoes', 'maroon'],
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
