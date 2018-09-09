import { GameObject } from '../../../common/GameObject';
import { Grid } from '../../../common/Grid';
import { X, Y } from '../../../common/domain/Location';

export class Zone {
    private objects = new Set<GameObject>();

    constructor(private grid: Grid) {
    }

    addObject(object: GameObject) {
        this.objects.add(object);
    }

    removeObject(object: GameObject): void {
        this.objects.delete(object);
    }

    query(except: GameObject): GameObject[] {
        const result: GameObject[] = [];
        this.objects.forEach(object => {
            if (except === object) {
                return;
            }
            result.push(object);
        });
        return result;
    }

    update(interval: number) {
        this.objects.forEach((obj: GameObject) => {
            const { x, y } = obj.position;

            let newX = x + obj.speed.x / 1000 * interval as X;
            let newY = y + obj.speed.y / 1000 * interval as Y;


            if (obj.speed.x !== 0) {
                const dir = Math.sign(obj.speed.x);
                const side = dir === 1 ? 1 : 0;

                for (let i = Math.floor(x); i * dir <= Math.floor(newX) * dir; i += dir) {
                    if (this.grid.hasBlock(i + side, Math.floor(y)) || this.grid.hasBlock(i + side, Math.ceil(y))) {
                        newX = i + 1 - side as X;
                        break;
                    }
                }
            }
            if (obj.speed.y !== 0) {
                const dir = Math.sign(obj.speed.y);
                const side = dir === 1 ? 1 : 0;

                for (let i = Math.floor(y); i * dir <= Math.floor(newY) * dir; i += dir) {
                    if (this.grid.hasBlock(Math.floor(x), i + side) || this.grid.hasBlock(Math.ceil(x), i + side)) {
                        newY = i + 1 - side as Y;
                        break;
                    }
                }
            }

            obj.position.x = newX;
            obj.position.y = newY;

        });
    }
}
