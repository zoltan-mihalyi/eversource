import { Grid, GridBlock } from '../../../common/Grid';
import { Position, X, Y } from '../../../common/domain/Location';
import { EntityData, EntityId } from '../../../common/domain/EntityData';

let nextId = 0;

export abstract class Entity<O extends EntityData = EntityData> {
    readonly id = nextId++ as EntityId;

    protected constructor(protected state: O) {
    }

    protected set<K extends keyof O>(partial: Pick<O, K>) {
        this.state = {
            ...this.state as any,
            ...partial as any,
        };
    }

    setSingle<K extends keyof O>(key: K, value: O[K]) {
        if (value !== this.state[key]) {
            this.state = {
                ...this.state as any,
                [key]: value,
            }
        }
    }

    get(): O {
        return this.state;
    }

    update(grid: Grid, delta: number) {
    }

    tryMove(grid: Grid, dx: number, dy: number) {
        const { x, y } = this.state.position;

        let newX = x + dx;
        let newY = y + dy;

        if (dx !== 0) {
            const dir = Math.sign(dx);
            const side = dir === 1 ? 1 : 0;

            for (let i = Math.floor(x); i * dir <= Math.floor(newX) * dir; i += dir) {
                const edge1 = getHorizontalEdge(grid.getBlock(i + side, Math.floor(y)), 1 - side, y % 1);
                const edge2 = getHorizontalEdge(grid.getBlock(i + side, Math.floor(y)), 1 - side, 1);
                const edge3 = getHorizontalEdge(grid.getBlock(i + side, Math.ceil(y)), 1 - side, y % 1);
                const closestEdge = Math.min(edge1 * dir, edge2 * dir, edge3 * dir) * dir;
                if ((newX * dir) > (i + closestEdge) * dir) {
                    newX = (i + closestEdge);
                    break;
                }
            }
        }
        if (dy !== 0) {
            const dir = Math.sign(dy);
            const side = dir === 1 ? 1 : 0;

            for (let i = Math.floor(y); i * dir <= Math.floor(newY) * dir; i += dir) {
                const edge1 = getVerticalEdge(grid.getBlock(Math.floor(newX), i + side), 1 - side, newX % 1);
                const edge2 = getVerticalEdge(grid.getBlock(Math.floor(newX), i + side), 1 - side, 1);
                const edge3 = getVerticalEdge(grid.getBlock(Math.ceil(newX), i + side), 1 - side, newX % 1);
                const closestEdge = Math.min(edge1 * dir, edge2 * dir, edge3 * dir) * dir;
                if ((newY * dir) > (i + closestEdge) * dir) {
                    newY = (i + closestEdge);
                    break;
                }
            }
        }

        if (newX !== x || newY !== y) {
            this.set({
                position: { x: newX as X, y: newY as Y } as Position,
            });
        }
    }
}


function getHorizontalEdge(block: GridBlock, side: number, y: number) {
    switch (block) {
        case GridBlock.EMPTY:
            return side === 0 ? Infinity : -Infinity;
        case GridBlock.TOP_LEFT:
            return side === 0 ? 0 : 1 - y;
        case GridBlock.TOP_RIGHT:
            return side === 1 ? 1 : y;
        case GridBlock.BOTTOM_LEFT:
            return side === 0 ? 0 : y;
        case GridBlock.BOTTOM_RIGHT:
            return side === 1 ? 1 : 1 - y;
        default:
            return side;
    }
}

function getVerticalEdge(block: GridBlock, side: number, x: number) {
    switch (block) {
        case GridBlock.EMPTY:
            return side === 0 ? Infinity : -Infinity;
        case GridBlock.TOP_LEFT:
            return side === 0 ? 0 : 1 - x;
        case GridBlock.TOP_RIGHT:
            return side === 0 ? 0 : x;
        case GridBlock.BOTTOM_LEFT:
            return side === 1 ? 1 : x;
        case GridBlock.BOTTOM_RIGHT:
            return side === 1 ? 1 : 1 - x;
        default:
            return side;
    }
}

