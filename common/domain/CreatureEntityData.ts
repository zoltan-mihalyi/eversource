import { HumanoidEntityData } from './HumanoidEntityData';
import { BaseEntityData } from './EntityData';
import { MonsterEntityData } from './MonsterEntityData';

export type Direction = 'up' | 'down' | 'left' | 'right';
export type CreatureEntityInteraction = 'trade' | 'quest';
export type CreatureActivity = 'walking' | 'standing' | 'casting';

export interface BaseCreatureEntityData extends BaseEntityData {
    type: 'creature';
    kind: string;
    level: number;
    hp: number;
    maxHp: number;
    player: boolean;
    interaction: CreatureEntityInteraction[];
    direction: Direction;
    activity: CreatureActivity;
    activitySpeed: number;
}

export type CreatureEntityData = HumanoidEntityData | MonsterEntityData;