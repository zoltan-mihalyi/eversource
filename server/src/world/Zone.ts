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
            const newX = obj.position.x + obj.speed.x / 1000 * interval;
            const newY = obj.position.y + obj.speed.y / 1000 * interval;

            obj.position.x = newX as X;
            obj.position.y = newY as Y;
        });
    }
}
