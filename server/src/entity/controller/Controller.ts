import { CreatureEntity } from '../CreatureEntity';

export interface Moving {
    x: number;
    y: number;
}

export class Controller {
    private moving: Moving = { x: 0, y: 0 };

    getMoving(): Moving {
        return this.moving;
    }

    update(entity: CreatureEntity, delta: number) {
    }

    protected setMoving(x: number, y: number) {
        const len = Math.sqrt(x * x + y * y);
        if (len > 1) {
            x /= len;
            y /= len;
        }

        this.moving = { x, y };
    }
}
