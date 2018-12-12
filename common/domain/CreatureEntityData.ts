import { HumanoidEntityData } from './HumanoidEntityData';
import { BaseEntityData } from './EntityData';
import { MonsterEntityData } from './MonsterEntityData';

export type Direction = 'up' | 'down' | 'left' | 'right';
export type CreatureActivity = 'walking' | 'standing' | 'casting';

export const enum CreatureAttitude {
    FRIENDLY,
    NEUTRAL,
    HOSTILE
}

export type EffectType = 'speed' | 'alpha' | 'poison' | 'fire' | 'ice' | 'stone' | 'light';

export interface Effect {
    type: EffectType;
    param: number;
}

export interface BaseCreatureEntityData extends BaseEntityData {
    level: number;
    hp: number;
    maxHp: number;
    player: boolean;
    direction: Direction;
    activity: CreatureActivity;
    activitySpeed: number;
    attitude: CreatureAttitude;
    scale: number;
    effects: Effect[];
}

export type CreatureEntityData = HumanoidEntityData | MonsterEntityData;