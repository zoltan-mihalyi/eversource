import { Opaque } from '../util/Opaque';
import { Position } from './Location';
import { CreatureEntityData } from './CreatureEntityData';
import { ObjectEntityData } from './ObjectEntityData';

export type EntityId = Opaque<number, 'EntityId'>;


export interface BaseEntityData {
    type: string;
    position: Position;
}

export interface EffectEntityData extends BaseEntityData {
    type: 'effect';
}

export type EntityData = CreatureEntityData | ObjectEntityData | EffectEntityData;
