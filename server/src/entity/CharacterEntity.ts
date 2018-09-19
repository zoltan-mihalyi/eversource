import { Entity } from './Entity';
import { Appearance, CharacterGameObject, Direction, Equipment, ObjectId, Position } from '../../../common/GameObject';
import { Grid } from '../../../common/Grid';

export interface Moving {
    x: number;
    y: number;
}

export class CharacterEntity extends Entity<CharacterGameObject> {
    private moving: Moving = { x: 0, y: 0 };

    constructor(position: Position, appearance: Appearance, equipment: Equipment) {
        super({
            position,
            type: 'character',
            direction: 'D',
            animation: 'standing',
            appearance,
            equipment,
            speed: 0,
        });
    }

    update(grid: Grid, delta: number) {
        const mul = this.getSpeed() / 1000 * delta;

        const { x, y } = this.state.position;
        super.tryMove(grid, this.moving.x * mul, this.moving.y * mul);
        const newPosition = this.state.position;
        const speed = length(newPosition.x - x, newPosition.y - y) * 1000 / delta;
        this.setSingle('speed', speed);
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
            this.setSingle('direction', direction);
            this.setSingle('animation', 'walking');
        } else {
            this.setSingle('animation', 'standing');
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