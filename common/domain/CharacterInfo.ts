import { Opaque } from '../util/Opaque';
import { Location } from './Location';

export type ClassId = Opaque<string, 'ClassId'>;
export type CharacterId = Opaque<string, 'CharacterId'>;
export type CharacterName = Opaque<string, 'CharacterName'>;


export interface CharacterInfo {
    id: CharacterId;
    name: CharacterName;
    classId: ClassId;
    location: Location;
}
