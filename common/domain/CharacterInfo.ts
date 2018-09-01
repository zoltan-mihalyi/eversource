import { Opaque } from '../util/Opaque';
import { Location } from './Location';

export type ClassId = Opaque<string, 'ClassId'>;
export type CharacterId = Opaque<string, 'CharacterId'>;


export interface CharacterInfo {
    id: CharacterId;
    classId: ClassId;
    location: Location;
}
