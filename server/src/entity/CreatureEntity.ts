import { Entity, EntityEvent, HiddenEntityData } from './Entity';
import { Grid } from '../../../common/Grid';
import {
    BaseCreatureEntityData,
    CreatureAttitude,
    CreatureEntityData,
    Direction,
} from '../../../common/domain/CreatureEntityData';
import { HumanoidEntityData } from '../../../common/domain/HumanoidEntityData';
import { Omit } from '../../../common/util/Omit';
import { MonsterEntityData } from '../../../common/domain/MonsterEntityData';
import { Controller } from './controller/Controller';
import { EntityOwner } from './EntityOwner';
import { basicAttack } from '../../../common/algorithms';
import { getDirection } from '../../../common/game/direction';

type BaseKeys = 'position' | 'name' | 'level' | 'hp' | 'maxHp' | 'scale';

type BaseHumanoid = Omit<HumanoidEntityData, BaseKeys | 'appearance' | 'equipment'>;

const BASE_CREATURE: Omit<BaseCreatureEntityData, BaseKeys> = {
    activity: 'standing',
    activitySpeed: 0,
    direction: 'down',
    interaction: null,
    player: false,
    attitude: CreatureAttitude.FRIENDLY,
    effects: [],
};

export const BASE_HUMANOID: BaseHumanoid = {
    ...BASE_CREATURE,
    type: 'humanoid',
};

type BaseMonster = Omit<MonsterEntityData, BaseKeys | 'image'>;

export const BASE_MONSTER: BaseMonster = {
    ...BASE_CREATURE,
    attitude: CreatureAttitude.HOSTILE,
    type: 'monster',
    palette: null,
};

export interface HiddenCreatureEntityData extends HiddenEntityData {
    name: string;
}

export class CreatureEntity extends Entity<CreatureEntityData, HiddenCreatureEntityData> {

    constructor(owner: EntityOwner, data: CreatureEntityData, hidden: HiddenCreatureEntityData,
                private controller: Controller = new Controller()) {

        super(owner, data, hidden);
    }

    update(grid: Grid, delta: number) {
        super.update(grid, delta);

        const deltaSec = delta / 1000;

        const mul = this.getSpeed() * deltaSec;

        this.controller.update(this, delta);

        const { x, y } = this.state.position;
        const moving = this.controller.getMoving();
        super.tryMove(grid, moving.x * mul, moving.y * mul);

        const newPosition = this.state.position;
        const dx = newPosition.x - x;
        const dy = newPosition.y - y;

        const direction = getDirection(dx, dy);
        if (direction) {
            this.setSingle('direction', direction);
            this.setSingle('activity', 'walking');
        } else {
            this.setSingle('activity', 'standing');
        }

        const speed = length(dx, dy) / deltaSec;
        this.setSingle('activitySpeed', speed);

        this.setSingle('hp', Math.min(this.state.maxHp, this.state.hp + this.getHpRegen() * deltaSec));
    }

    emit(event: EntityEvent) {
        this.owner.emit(event);
    }

    hit(other: CreatureEntity) {
        const hp = Math.max(0, this.get().hp - basicAttack(other.get().level));
        if (hp === 0) {
            this.owner.removeEntity();
            other.emit({ type: 'kill', name: this.hidden.name, data: this.get() });
        } else {
            this.set({ hp });
        }
    }

    protected getSize() {
        return this.state.scale;
    }

    private getSpeed() {
        return 4;
    }

    private getHpRegen() {
        return 3;
    }
}

function length(x: number, y: number): number {
    return Math.sqrt(x * x + y * y);
}
