import { Opaque } from '../util/Opaque';
import { Location } from './Location';
import { Appearance } from '../components/View';
import { InventoryItem } from '../../server/src/Item';

export type ClassId = 'warrior' | 'hunter' | 'mage';
export type CharacterId = Opaque<string, 'CharacterId'>;
export type CharacterName = Opaque<string, 'CharacterName'>;

export type EquipmentSlotId = 'shirt' | 'head' | 'cape' | 'belt' | 'arms' | 'chest' | 'legs' | 'hands' | 'feet';

export type Equipment = Map<EquipmentSlotId, InventoryItem>;

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
