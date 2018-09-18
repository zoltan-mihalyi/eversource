import { GameObject, ObjectId, Position } from '../../../common/GameObject';
import { Grid } from '../../../common/Grid';
import { X, Y } from '../../../common/domain/Location';

export abstract class Entity<O extends GameObject = GameObject> {
    protected constructor(readonly id: ObjectId, protected state: O) {
    }

    protected set<K extends keyof O>(partial: Pick<O, K>) {
        this.state = {
            ...this.state as any,
            ...partial as any,
        };
    }

    protected setSingle<K extends keyof O>(key: K, value: O[K]) {
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
                if (grid.hasBlock(i + side, Math.floor(y)) || grid.hasBlock(i + side, Math.ceil(y))) {
                    newX = i + 1 - side;
                    break;
                }
            }
        }
        if (dy !== 0) {
            const dir = Math.sign(dy);
            const side = dir === 1 ? 1 : 0;

            for (let i = Math.floor(y); i * dir <= Math.floor(newY) * dir; i += dir) {
                if (grid.hasBlock(Math.floor(x), i + side) || grid.hasBlock(Math.ceil(x), i + side)) {
                    newY = i + 1 - side;
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