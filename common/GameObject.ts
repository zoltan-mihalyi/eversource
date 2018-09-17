import { X, Y } from './domain/Location';
import { Opaque } from './util/Opaque';

export type Direction = 'U' | 'D' | 'L' | 'R';

export interface Position {
    x: X;
    y: Y;
}

export type XPerSecond = Opaque<number, 'XPerSecond'>;
export type YPerSecond = Opaque<number, 'YPerSecond'>;

export interface Speed {
    x: XPerSecond;
    y: YPerSecond;
}

export type ObjectId = Opaque<number, 'ObjectId'>;

interface BaseGameObject {
    id: ObjectId;
    type: string;
    position: Position;
}

export type CharacterAnimation = 'standing' | 'walking' | 'casting';

export interface CharacterGameObject extends BaseGameObject {
    type: 'character';
    animation: CharacterAnimation;
    direction: Direction;
    speed: number;
}

export type  GameObject = CharacterGameObject;
