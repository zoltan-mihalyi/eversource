import { Opaque } from '../util/Opaque';
import { Position } from './Location';
import { CreatureEntityData } from './CreatureEntityData';
import { ObjectEntityData } from './ObjectEntityData';
import { NonEmptyArray } from '../util/NonEmptyArray';


export type EntityInteraction = 'trade' | 'quest' | 'quest-complete' | 'quest-complete-later' | 'pickup' | 'use';

export type EntityInteractions = NonEmptyArray<EntityInteraction>;

export interface BaseEntityData {
    position: Position;
    name: string;
    interaction: EntityInteractions | null;
}

export interface EffectEntityData extends BaseEntityData {
    type: 'effect';
}

export type EntityData = CreatureEntityData | ObjectEntityData | EffectEntityData;
