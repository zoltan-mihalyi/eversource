import { Opaque } from '../util/Opaque';

export type X = Opaque<number, 'X'>;
export type Y = Opaque<number, 'Y'>;
export type ZoneId = Opaque<string, 'ZoneId'>;

export interface Location {
    x: X;
    y: Y;
    zoneId: ZoneId;
}