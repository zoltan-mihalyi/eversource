import { Opaque } from '../util/Opaque';
import { Location } from './Location';
import { Appearance, Equipment } from './HumanoidEntityData';

export type ClassId = Opaque<string, 'ClassId'>;
export type CharacterId = Opaque<string, 'CharacterId'>;
export type CharacterName = Opaque<string, 'CharacterName'>;

export interface CharacterInfo {
    id: CharacterId;
    level: number; // TODO synchronize with entity
    xp: number;
    name: CharacterName;
    classId: ClassId;
    location: Location;
    hp: number;
    appearance: Appearance;
    equipment: Equipment;
}
