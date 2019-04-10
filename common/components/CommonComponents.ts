import { Position } from '../domain/Location';
import { View } from './View';

export type Direction = 'up' | 'down' | 'left' | 'right';
export type Activity = 'walking' | 'casting' | 'standing';

export interface Animation {
    speed: number;
}

export interface Scale {
    readonly value: number;
}

export const enum CreatureAttitude {
    FRIENDLY,
    NEUTRAL,
    HOSTILE
}

export interface Attitude {
    readonly value: CreatureAttitude;
}

export interface Hp {
    readonly max: number;
    readonly current: number;
}

export interface Level {
    readonly value: number;
}

export interface Xp {
    readonly value: number;
}

interface Name {
    readonly value: string;
}

export type EffectType = 'speed' | 'alpha' | 'poison' | 'fire' | 'ice' | 'stone' | 'light';

export interface Effect {
    type: EffectType;
    param: number;
}

export interface EffectAnimation {
    image: string;
    animation: string;
}

export interface CommonComponents {
    direction: Direction;
    activity: Activity;
    view: View;
    animation: Animation;
    position: Position;
    name: Name;
    scale: Scale;
    attitude: Attitude;
    hp: Hp;
    level: Level;
    player: true;
    effects: Effect[];
    ambientAnimations: EffectAnimation[];
}
