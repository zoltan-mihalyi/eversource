import { BaseCreatureEntityData } from './CreatureEntityData';


export interface MonsterEntityData extends BaseCreatureEntityData {
    kind: 'monster';
    image: string;
    palette: string | null;
}