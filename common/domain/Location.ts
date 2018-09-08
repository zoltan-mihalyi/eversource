import { Opaque } from '../util/Opaque';
import { Position } from '../GameObject';

export type X = Opaque<number, 'X'>;
export type Y = Opaque<number, 'Y'>;
export type ZoneId = Opaque<string, 'ZoneId'>;

export interface Location {
    position: Position;
    zoneId: ZoneId;
}