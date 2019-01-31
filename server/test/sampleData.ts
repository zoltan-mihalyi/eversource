import { Position, X, Y } from '../../common/domain/Location';

export function position(x: number, y: number): Position {
    return {
        x: x as X,
        y: y as Y,
    };
}