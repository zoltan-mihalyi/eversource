import { Entity } from './Entity';
import {
    Appearance,
    CharacterAnimation,
    CharacterGameObject,
    Direction, Equipment,
    ObjectId,
    Position
} from '../../../common/GameObject';
import { Grid } from '../../../common/Grid';

export interface Moving {
    x: number;
    y: number;
}

export class CharacterEntity extends Entity {
    private direction: Direction = 'D';
    private animation: CharacterAnimation = 'standing';
    private moving: Moving = { x: 0, y: 0 };
    private lastSpeed: number = 0;

    constructor(id: ObjectId, position: Position, private appearance: Appearance, private equipment: Equipment) {
        super(id, position);
    }

    toGameObject(): CharacterGameObject {
        return {
            id: this.id,
            position: this.position,
            type: 'character',
            direction: this.direction,
            animation: this.animation,
            appearance: this.appearance,
            equipment: this.equipment,
            speed: this.lastSpeed,
        }
    }

    update(grid: Grid, delta: number) {
        const mul = this.getSpeed() / 1000 * delta;

        const { x, y } = this.position;
        super.tryMove(grid, this.moving.x * mul, this.moving.y * mul);
        this.lastSpeed = length(this.position.x - x, this.position.y - y) * 1000 / delta;
    }

    setMoving(x: number, y: number) {

        let direction: Direction | null = null;
        const xLarger = Math.abs(x) > Math.abs(y);
        if (xLarger) {
            direction = x > 0 ? 'R' : 'L';
        } else if (y < 0) {
            direction = 'U';
        } else if (y > 0) {
            direction = 'D';
        }
        if (direction) {
            this.direction = direction;
            this.animation = 'walking';
        } else {
            this.animation = 'standing';
        }

        this.moving = { x, y };
    }

    private getSpeed() {
        return 4;
    }
}

function length(x: number, y: number): number {
    return Math.sqrt(x * x + y * y);
}