import { HumanoidEntityData } from './HumanoidEntityData';
import { BaseEntityData } from './EntityData';
import { MonsterEntityData } from './MonsterEntityData';

export type Direction = 'up' | 'down' | 'left' | 'right';
export type CreatureActivity = 'walking' | 'standing' | 'casting';

export interface BaseCreatureEntityData extends BaseEntityData {
    level: number;
    hp: number;
    maxHp: number;
    player: boolean;
    direction: Direction;
    activity: CreatureActivity;
    activitySpeed: number;
}

export type CreatureEntityData = HumanoidEntityData | MonsterEntityData;