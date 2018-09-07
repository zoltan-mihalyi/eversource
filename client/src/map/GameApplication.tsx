import * as PIXI from 'pixi.js';
import {Location, X, Y} from '../../../common/domain/Location';
import {GameLevel} from './GameLevel';
import {InputHandler, KEYS} from "../InputHandler";

export class GameApplication extends PIXI.Application {
    private viewContainer = new PIXI.Container();
    private centerX = 0 as X;
    private centerY = 0 as Y;
    private timer: number;
    private inputHandler: InputHandler;
    private lastDirection = {
        x: 0,
        y: 0,
    };

    constructor(canvas: HTMLCanvasElement, private gameLevel: GameLevel, location: Location, private ws: WebSocket) {
        super({view: canvas});

        this.viewContainer.scale.x = gameLevel.map.tileWidth;
        this.viewContainer.scale.y = gameLevel.map.tileHeight;

        this.timer = requestAnimationFrame(this.update);

        this.viewContainer.addChild(gameLevel.container);
        this.stage.addChild(this.viewContainer);

        this.setViewCenter(location.x, location.y);

        this.inputHandler = new InputHandler();
    }

    destroy() {
        cancelAnimationFrame(this.timer);
        this.inputHandler.destroy();
        super.destroy();
    }

    private setViewCenter(x: X, y: Y) {
        this.centerX = x;
        this.centerY = y;

        this.updateView();
    }


    updateView = () => {
        const viewContainer = this.viewContainer;
        const canvas = this.view;

        viewContainer.x = Math.floor(-this.centerX * viewContainer.scale.x + canvas.width / 2);
        viewContainer.y = Math.floor(-this.centerY * viewContainer.scale.y + canvas.height / 2);

        this.gameLevel.setVisibleArea(
            -viewContainer.x / viewContainer.scale.x as X,
            -viewContainer.y / viewContainer.scale.y as Y,
            canvas.width / viewContainer.scale.x,
            canvas.height / viewContainer.scale.y,
        );
    };

    private update = () => {
        let directionX = 0;
        let directionY = 0;
        if (this.inputHandler.isDown(KEYS.W)) {
            directionY = -1;
        } else if (this.inputHandler.isDown(KEYS.S)) {
            directionY = 1;
        }
        if (this.inputHandler.isDown(KEYS.A)) {
            directionX = -1;
        } else if (this.inputHandler.isDown(KEYS.D)) {
            directionX = 1;
        }
        if (directionX !== this.lastDirection.x || directionY !== this.lastDirection.y) {
            this.ws.send('command:move:' + directionX + ',' + directionY);
        }
        this.lastDirection.x = directionX;
        this.lastDirection.y = directionY;
        this.inputHandler.clear();
        this.timer = requestAnimationFrame(this.update);
    };
}