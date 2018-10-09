import { BaseCreatureEntityData } from './CreatureEntityData';

export interface MonsterEntityData extends BaseCreatureEntityData {
    type: 'monster';
    image: string;
    palette: string | null;
}