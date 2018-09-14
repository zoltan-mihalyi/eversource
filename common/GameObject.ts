import { X, Y } from './domain/Location';
import { Opaque } from './util/Opaque';

export type Direction = 'U' | 'D' | 'L' | 'R';
export type Type = 'character' | 'arrow';

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

export interface GameObject {
    id: ObjectId;
    type: Type;
    position: Position;
    speed: Speed;
    direction: Direction;
}