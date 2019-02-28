import { Direction } from '../components/CommonComponents';

export function getDirection(dx: number, dy: number): Direction | null {
    const xLarger = Math.abs(dx) > Math.abs(dy);
    if (xLarger) {
        return dx > 0 ? 'right' : 'left';
    } else if (dy < 0) {
        return 'up';
    } else if (dy > 0) {
        return 'down';
    }
    return null;
}
