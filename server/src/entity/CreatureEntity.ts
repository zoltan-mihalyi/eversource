import { Entity, HiddenEntityData } from './Entity';
import { Grid } from '../../../common/Grid';
import { BaseCreatureEntityData, CreatureAttitude, CreatureEntityData, Direction } from '../../../common/domain/CreatureEntityData';
import { HumanoidEntityData } from '../../../common/domain/HumanoidEntityData';
import { Omit } from '../../../common/util/Omit';
import { MonsterEntityData } from '../../../common/domain/MonsterEntityData';
import { Controller } from './controller/Controller';
import { canInteract } from '../../../common/game/Interaction';
import { questsById } from '../quest/QuestIndexer';

type BaseHumanoid = Omit<HumanoidEntityData, 'position' | 'name' | 'scale' | 'appearance' | 'equipment'>;

const BASE_CREATURE: Omit<BaseCreatureEntityData, 'position' | 'name' | 'scale'> = {
    activity: 'standing',
    activitySpeed: 0,
    direction: 'down',
    interaction: null,
    level: 1,
    hp: 100,
    maxHp: 100,
    player: false,
    attitude: CreatureAttitude.FRIENDLY,
};

export const BASE_HUMANOID: BaseHumanoid = {
    ...BASE_CREATURE,
    type: 'humanoid',
};

type BaseMonster = Omit<MonsterEntityData, 'position' | 'name' | 'scale' | 'image'>;

export const BASE_MONSTER: BaseMonster = {
    ...BASE_CREATURE,
    attitude: CreatureAttitude.HOSTILE,
    type: 'monster',
    palette: null,
};

export class CreatureEntity extends Entity<CreatureEntityData> {

    constructor(data: CreatureEntityData, hidden: HiddenEntityData | undefined, private controller: Controller = new Controller()) {
        super(data, hidden);
    }

    update(grid: Grid, delta: number) {
        const deltaSec = delta / 1000;

        const mul = this.getSpeed() * deltaSec;

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

        const speed = length(dx, dy) / deltaSec;
        this.setSingle('activitySpeed', speed);

        this.setSingle('hp', Math.min(this.state.maxHp, this.state.hp + this.getHpRegen() * deltaSec));

        this.updatePlayerState();
    }

    emit(eventType: string, payload?: any) {
        const { player } = this.hidden;
        if (!player) {
            return;
        }
        const { questLog } = player.state;
        questLog.forEach((q, questId) => {
            if (q === 'failed') {
                return;
            }
            const tasks = questsById[questId]!.tasks;
            if (!tasks) {
                return;
            }

            tasks.list.forEach((task, i) => {
                if (task.type === 'visit' && eventType === 'area' && task.areaName === payload) {
                    questLog.set(questId, q.map((num, id) => id == i ? 1 : num));
                }
            });
        });
    }

    protected getSize() {
        return this.state.scale;
    }

    private updatePlayerState() {
        const { player } = this.hidden;
        if (!player) {
            return;
        }
        const { state, details } = player;

        if (state.interacting && !canInteract(this.get(), state.interacting.getFor(details))) {
            state.interacting = void 0;
        }
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