import { Entity } from './Entity';
import { Grid } from '../../../common/Grid';
import { BaseCreatureEntityData, CreatureEntityData, Direction } from '../../../common/domain/CreatureEntityData';
import { HumanoidEntityData } from '../../../common/domain/HumanoidEntityData';
import { Omit } from '../../../common/util/Omit';
import { MonsterEntityData } from '../../../common/domain/MonsterEntityData';

export interface Moving {
    x: number;
    y: number;
}

type BaseHumanoid = Omit<HumanoidEntityData, 'position' | 'appearance' | 'equipment'>;

const BASE_CREATURE: Omit<BaseCreatureEntityData, 'position'> = {
    type: 'creature',
    activity: 'standing',
    activitySpeed: 0,
    direction: 'down',
    level: 1,
    hp: 100,
    maxHp: 100,
    kind: '?',
    player: false,
    interaction: [],
};

export const BASE_HUMANOID: BaseHumanoid = {
    ...BASE_CREATURE,
    kind: 'humanoid',
    player: false,
};

type BaseMonster = Omit<MonsterEntityData, 'position' | 'image'>;

export const BASE_MONSTER: BaseMonster = {
    ...BASE_CREATURE,
    kind:'monster',
    palette: null,
};

export class CreatureEntity extends Entity<CreatureEntityData> {
    private moving: Moving = { x: 0, y: 0 };

    constructor(data: CreatureEntityData) {
        super(data);
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