import { Controller } from './Controller';

export class PlayerController extends Controller {
    move(x: number, y: number) {
        this.setMoving(x, y);
    }
}