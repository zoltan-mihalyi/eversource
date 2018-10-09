import { Opaque } from '../util/Opaque';
import { Position } from './Location';
import { CreatureEntityData } from './CreatureEntityData';
import { ObjectEntityData } from './ObjectEntityData';

export type EntityId = Opaque<number, 'EntityId'>;

export type EntityInteraction = 'trade' | 'quest' | 'pickup' | 'use';

export interface BaseEntityData {
    position: Position;
    interaction?: EntityInteraction[];
}

export interface EffectEntityData extends BaseEntityData {
    type: 'effect';
}

export type EntityData = CreatureEntityData | ObjectEntityData | EffectEntityData;
