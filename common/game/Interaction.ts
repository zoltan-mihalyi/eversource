import { EntityData } from '../domain/EntityData';
import { Position } from '../domain/Location';

export function canInteract(player: EntityData, other: EntityData) {
    return distance(player.position, other.position) < 4 && other.interaction !== null;
}

function distance(p1: Position, p2: Position): number {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    return Math.sqrt(dx * dx + dy * dy);
}