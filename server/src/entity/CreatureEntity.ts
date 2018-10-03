import { Entity } from './Entity';
import { Grid } from '../../../common/Grid';
import { CreatureEntityData, Direction } from '../../../common/domain/CreatureEntityData';
import { Position } from '../../../common/domain/Location';
import { Appearance, Equipment } from '../../../common/domain/HumanoidEntityData';

export interface Moving {
    x: number;
    y: number;
}

export class CreatureEntity extends Entity<CreatureEntityData> {
    private moving: Moving = { x: 0, y: 0 };

    constructor(position: Position, direction: Direction, appearance: Appearance, equipment: Equipment) {
        super({
            position,
            type: 'creature',
            kind: 'humanoid',
            direction: 'down',
            player: false,
            interaction: [],
            level: 1,
            hp: 100,
            maxHp: 100,
            appearance,
            equipment,
            activity: 'standing',
            activitySpeed: 0,
        });
    }

    update(grid: Grid, delta: number) {
        const mul = this.getSpeed() / 1000 * delta;

        const { x, y } = this.state.position;
        super.tryMove(grid, this.moving.x * mul, this.moving.y * mul);
        const newPosition = this.state.position;
        const speed = length(newPosition.x - x, newPosition.y - y) * 1000 / delta;
        this.setSingle('activitySpeed', speed);
    }

    setMoving(x: number, y: number) {

        let direction: Direction | null = null;
        const xLarger = Math.abs(x) > Math.abs(y);
        if (xLarger) {
            direction = x > 0 ? 'right' : 'left';
        } else if (y < 0) {
            direction = 'up';
        } else if (y > 0) {
            direction = 'down';
        }
        if (direction) {
            this.setSingle('direction', direction);
            this.setSingle('activity', 'walking');
        } else {
            this.setSingle('activity', 'standing');
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