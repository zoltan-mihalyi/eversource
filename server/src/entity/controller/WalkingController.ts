import { Controller } from './Controller';
import { Position, X, Y } from '../../../../common/domain/Location';
import { CreatureEntity } from '../CreatureEntity';


const RADIUS_X = 6;
const RADIUS_Y = 5;
const WALK_SPEED = 0.3;

export class WalkingController extends Controller {
    private nextMoveTime = 0;
    private target: Position = this.initialPosition;

    constructor(private initialPosition: Position) {
        super();
    }

    update(entity: CreatureEntity, delta: number) {
        const { x, y } = entity.get().position;

        const dx = this.target.x - x;
        const dy = this.target.y - y;

        this.setMoving(Math.abs(dx) > 0.2 ? Math.sign(dx) * WALK_SPEED : 0, Math.abs(dy) > 0.2 ? Math.sign(dy) * WALK_SPEED : 0);

        if (this.nextMoveTime <= 0) {
            this.moveToRandom();
            this.nextMoveTime = Math.random() * 10000;
        }
        this.nextMoveTime -= delta;
    }

    private moveToRandom() {
        this.target = {
            x: this.initialPosition.x - RADIUS_X + Math.random() * RADIUS_X * 2 as X,
            y: this.initialPosition.y - RADIUS_Y + Math.random() * RADIUS_Y * 2 as Y,
        };
    }
}
