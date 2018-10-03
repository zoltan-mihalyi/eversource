import { BaseEntityData } from './EntityData';

export type ObjectEntityInteraction = 'no' | 'pickup' | 'use';

export interface ObjectEntityData extends BaseEntityData{
    type: 'object';
    interaction: ObjectEntityInteraction;
}
