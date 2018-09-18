import { X, Y } from './domain/Location';
import { Opaque } from './util/Opaque';

export type Direction = 'U' | 'D' | 'L' | 'R';

export interface Position {
    x: X;
    y: Y;
}

export type ObjectId = Opaque<number, 'ObjectId'>;

interface BaseGameObject {
    type: string;
    position: Position;
}

export type CharacterAnimation = 'standing' | 'walking' | 'casting';

export interface Appearance {
    sex: 'male' | 'female';
    body: string;
    ears: string | null;
    eyes: string | null;
    nose: string | null;
    hair: string | null;
}

export interface Equipment {
    shirt: string | null;
    head: string | null;
    chest: string | null;
    legs: string | null;
    feet: string | null;
}

export interface CharacterGameObject extends BaseGameObject {
    type: 'character';
    animation: CharacterAnimation;
    direction: Direction;
    appearance: Appearance;
    equipment: Equipment;
    speed: number;
}

export type  GameObject = CharacterGameObject;
