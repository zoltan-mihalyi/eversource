import { X, Y } from './domain/Location';

export type Direction = 'U' | 'D' | 'L' | 'R';
export type Type = 'character' | 'arrow';

export interface GameObject {
    type: Type;
    x: X;
    y: Y;
    direction: Direction;
}