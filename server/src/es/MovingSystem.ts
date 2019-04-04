import { ServerComponents } from './ServerComponents';
import { EventBus } from '../../../common/es/EventBus';
import { ServerEvents } from './ServerEvents';
import { EntityContainer } from '../../../common/es/EntityContainer';
import { Grid, GridBlock } from '../../../common/Grid';
import { Position, X, Y, distanceY, denormalizeDistanceY } from '../../../common/domain/Location';
import { getDirection } from '../../../common/game/direction';

export function movingSystem(grid: Grid, entityContainer: EntityContainer<ServerComponents>, eventBus: EventBus<ServerEvents>) {
    const query = entityContainer.createQuery('position', 'speed', 'moving');

    eventBus.on('update', ({ deltaInSec }) => {
        query.forEach((components, entity) => {
            const { position, speed, moving, scale } = components;

            let { x: dx, y: dy, running } = moving;

            const speedValue = running ? speed.running : speed.walking;

            const len = length(dx, dy);
            if (len > 1) {
                dx /= len;
                dy /= len;
            }
            dx *= speedValue * deltaInSec;
            dy *= speedValue * deltaInSec;

            const size = scale === void 0 ? 0 : scale.value;

            const newPosition = tryMove(grid, position, size, dx, denormalizeDistanceY(dy));
            entity.set('position', newPosition);

            const { activity } = components;
            if (activity) {
                const dx = newPosition.x - position.x;
                const dy = distanceY(newPosition.y, position.y);

                const direction = getDirection(dx, dy);
                if (direction) {
                    entity.set('direction', direction);
                    entity.set('activity', 'walking');
                    entity.set('animation', { speed: length(dx, dy) / deltaInSec });
                } else {
                    entity.set('activity', 'standing');
                    entity.set('animation', { speed: 0.2 }); // TODO
                }
            }
        });
    });
}

export function tryMove(grid: Grid, position: Position, size: number, dx: number, dy: number): Position {
    const { x, y } = position;

    let newX = x + dx;
    let newY = y + dy;

    const halfSize = size / 2;

    if (dx !== 0) {
        const dir = Math.sign(dx);
        const goingRight = dir > 0;
        const side = halfSize * dir;

        const top = y - halfSize;
        const bottom = y + halfSize - 1;

        for (let i = Math.floor(x + side); i * dir <= Math.floor(newX + side) * dir; i += dir) {
            const edges = [
                getHorizontalEdge(grid.getBlock(i, Math.floor(top)), goingRight, top % 1),
                getHorizontalEdge(grid.getBlock(i, Math.ceil(bottom)), goingRight, (bottom % 1) || 1),
            ];

            for (let j = Math.floor(top); j < Math.ceil(bottom); j += 1) {
                edges.push(getHorizontalEdge(grid.getBlock(i, j), goingRight, 1));
            }

            const closestEdge = dir === -1 ? Math.max(...edges) : Math.min(...edges);
            const closestX = i + closestEdge - side;
            if (newX * dir > closestX * dir) {
                newX = closestX;
                break;
            }
        }
    }
    if (dy !== 0) {
        const dir = Math.sign(dy);
        const goingDown = dir > 0;
        const side = halfSize * dir;

        const left = newX - halfSize;
        const right = newX + halfSize - 1;

        for (let j = Math.floor(y + side); j * dir <= Math.floor(newY + side) * dir; j += dir) {
            const edges = [
                getVerticalEdge(grid.getBlock(Math.floor(left), j), goingDown, left % 1),
                getVerticalEdge(grid.getBlock(Math.ceil(right), j), goingDown, (right % 1) || 1),
            ];

            for (let i = Math.floor(left); i < Math.ceil(right); i += 1) {
                edges.push(getVerticalEdge(grid.getBlock(i, j), goingDown, 1));
            }

            const closestEdge = dir === -1 ? Math.max(...edges) : Math.min(...edges);
            const closestY = j + closestEdge - side;
            if (newY * dir > closestY * dir) {
                newY = closestY;
                break;
            }
        }
    }

    if (newX !== x || newY !== y) {
        return {
            x: newX as X,
            y: newY as Y,
        };
    }
    return position;
}

function getHorizontalEdge(block: GridBlock, goingRight: boolean, y: number) {
    switch (block) {
        case GridBlock.EMPTY:
            return goingRight ? Infinity : -Infinity;
        case GridBlock.TOP_LEFT:
            return goingRight ? 0 : 1 - y;
        case GridBlock.TOP_RIGHT:
            return goingRight ? y : 1;
        case GridBlock.BOTTOM_LEFT:
            return goingRight ? 0 : y;
        case GridBlock.BOTTOM_RIGHT:
            return goingRight ? 1 - y : 1;
        default:
            return goingRight ? 0 : 1;
    }
}

function getVerticalEdge(block: GridBlock, goingDown: boolean, x: number) {
    switch (block) {
        case GridBlock.EMPTY:
            return goingDown ? Infinity : -Infinity;
        case GridBlock.TOP_LEFT:
            return goingDown ? 0 : 1 - x;
        case GridBlock.TOP_RIGHT:
            return goingDown ? 0 : x;
        case GridBlock.BOTTOM_LEFT:
            return goingDown ? x : 1;
        case GridBlock.BOTTOM_RIGHT:
            return goingDown ? 1 - x : 1;
        default:
            return goingDown ? 0 : 1;
    }
}

function length(x: number, y: number): number {
    return Math.sqrt(x * x + y * y);
}
