import { Controller } from './Controller';
import { Entity } from '../Entity';

export class PlayerController extends Controller {
    move(x: number, y: number) {
        this.setMoving(x, y);
    }
}