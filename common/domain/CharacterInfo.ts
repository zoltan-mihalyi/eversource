import { Opaque } from '../util/Opaque';
import { Location } from './Location';
import { Appearance, Equipment } from '../components/View';

export type ClassId = 'warrior' | 'hunter' | 'mage';
export type CharacterId = Opaque<string, 'CharacterId'>;
export type CharacterName = Opaque<string, 'CharacterName'>;

export interface CharacterInfo {
    id: CharacterId;
    level: number; // TODO synchronize with entity
    xp: number;
    name: CharacterName;
    sex: 'male' | 'female';
    classId: ClassId;
    location: Location;
    hp: number;
    appearance: Appearance;
    equipment: Equipment;
}
