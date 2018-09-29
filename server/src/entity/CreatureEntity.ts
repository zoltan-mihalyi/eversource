import { Entity } from './Entity';
import { Grid } from '../../../common/Grid';
import { BaseCreatureEntityData, CreatureEntityData, Direction } from '../../../common/domain/CreatureEntityData';
import { HumanoidEntityData } from '../../../common/domain/HumanoidEntityData';
import { Omit } from '../../../common/util/Omit';
import { MonsterEntityData } from '../../../common/domain/MonsterEntityData';
import { Controller } from './controller/Controller';


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
    kind: 'monster',
    palette: null,
};

export class CreatureEntity extends Entity<CreatureEntityData> {

    constructor(data: CreatureEntityData, private controller: Controller = new Controller()) {
        super(data);
    }

    update(grid: Grid, delta: number) {
        const mul = this.getSpeed() / 1000 * delta;

        this.controller.update(this, delta);

        const { x, y } = this.state.position;
        const moving = this.controller.getMoving();
        super.tryMove(grid, moving.x * mul, moving.y * mul);

        const newPosition = this.state.position;
        const dx = newPosition.x - x;
        const dy = newPosition.y - y;

        let direction: Direction | null = null;
        const xLarger = Math.abs(dx) > Math.abs(dy);
        if (xLarger) {
            direction = dx > 0 ? 'right' : 'left';
        } else if (dy < 0) {
            direction = 'up';
        } else if (dy > 0) {
            direction = 'down';
        }
        if (direction) {
            this.setSingle('direction', direction);
            this.setSingle('activity', 'walking');
        } else {
            this.setSingle('activity', 'standing');
        }

        const speed = length(dx, dy) * 1000 / delta;
        this.setSingle('activitySpeed', speed);
    }

    private getSpeed() {
        return 4;
    }
}

function length(x: number, y: number): number {
    return Math.sqrt(x * x + y * y);
}