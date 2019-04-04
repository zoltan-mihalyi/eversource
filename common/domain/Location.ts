import { Opaque } from '../util/Opaque';

export type X = Opaque<number, 'X'>;
export type Y = Opaque<number, 'Y'>;
export type ZoneId = Opaque<string, 'ZoneId'>;

const Y_FACTOR = Math.sin(60 * Math.PI / 180);

export interface Position {
    readonly x: X;
    readonly y: Y;
}

export interface Location {
    position: Position;
    zoneId: ZoneId;
}

export function distanceY(y1: Y, y2: Y): number {
    return (y1 - y2) / Y_FACTOR;
}

export function denormalizeDistanceY(yd: number): number {
    return yd * Y_FACTOR;
}
