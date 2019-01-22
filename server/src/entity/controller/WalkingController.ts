import { Controller } from './Controller';
import { Position, X, Y } from '../../../../common/domain/Location';
import { CreatureEntity } from '../CreatureEntity';
import { TiledProperties } from '../../../../common/tiled/interfaces';

export interface MovementConfig {
    speed?: number;
    interval?: number;
    radiusX?: number;
    radiusY?: number;
}

export class WalkingController extends Controller {
    private nextMoveTime = 0;
    private target: Position = this.initialPosition;
    private readonly speed: number;
    private readonly interval: number;
    private readonly radiusX: number;
    private readonly radiusY: number;

    constructor(private initialPosition: Position, config: MovementConfig = {}) {
        super();
        this.speed = (config.speed || 0.3) as number;
        this.interval = (config.interval || 10) as number;

        const radiusX = config.radiusX;
        const radiusY = config.radiusY;
        this.radiusX = typeof radiusX === 'number' ? radiusX : 6;
        this.radiusY = typeof radiusY === 'number' ? radiusY : 5;
    }

    update(entity: CreatureEntity, delta: number) {
        const { x, y } = entity.get().position;
        if (entity.isReferenced('interacting')) {
            this.setMoving(0, 0);
            return;
        }

        const dx = this.target.x - x;
        const dy = this.target.y - y;

        this.setMoving(Math.abs(dx) > 0.2 ? Math.sign(dx) * this.speed : 0, Math.abs(dy) > 0.2 ? Math.sign(dy) * this.speed : 0);

        if (this.nextMoveTime <= 0) {
            this.moveToRandom();
            this.nextMoveTime = Math.random() * this.interval * 1000;
        }
        this.nextMoveTime -= delta;
    }

    private moveToRandom() {
        this.target = {
            x: this.initialPosition.x - this.radiusX + Math.random() * this.radiusX * 2 as X,
            y: this.initialPosition.y - this.radiusY + Math.random() * this.radiusY * 2 as Y,
        };
    }
}
