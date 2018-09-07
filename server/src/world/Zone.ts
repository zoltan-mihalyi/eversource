import { GameObject } from '../../../common/GameObject';
import { Grid } from '../../../common/Grid';

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
}
