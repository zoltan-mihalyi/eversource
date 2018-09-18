import * as PIXI from 'pixi.js';
import { X, Y } from '../../../common/domain/Location';
import { GameLevel } from './GameLevel';
import { InputManager, MovementIntent } from '../input/InputManager';
import { GameState } from '../../../common/protocol/Messages';
import { Position } from '../../../common/GameObject';

export class GameApplication extends PIXI.Application {
    private viewContainer = new PIXI.Container();
    private centerX = 0 as X;
    private centerY = 0 as Y;
    private timer: number;
    readonly inputManager: InputManager;
    private lastMovementIntent: MovementIntent = { x: 0, y: 0 };

    constructor(readonly gameLevel: GameLevel, position: Position, private ws: WebSocket) {
        super();

        this.viewContainer.scale.x = gameLevel.map.tileWidth;
        this.viewContainer.scale.y = gameLevel.map.tileHeight;

        this.timer = requestAnimationFrame(this.update);

        this.viewContainer.addChild(gameLevel.container);
        this.stage.addChild(this.viewContainer);

        this.setViewCenter(position);

        this.inputManager = new InputManager();
    }

    destroy() {
        this.gameLevel.destroy();
        cancelAnimationFrame(this.timer);
        this.inputManager.destroy();
        super.destroy();
    }

    updateState(state: GameState) {
        this.setViewCenter(state.character.position);
        this.gameLevel.updateObjects([state.character, ...state.others]);
    }

    private setViewCenter(position: Position) {
        const { x, y } = this.gameLevel.round(position);

        this.centerX = x;
        this.centerY = y;

        this.updateView();
    }


    updateView = () => {
        const viewContainer = this.viewContainer;
        const canvas = this.view;

        const { tileWidth, tileHeight } = this.gameLevel.map;

        viewContainer.x = Math.floor(-this.centerX * viewContainer.scale.x + canvas.width / 2 - tileWidth / 2);
        viewContainer.y = Math.floor(-this.centerY * viewContainer.scale.y + canvas.height / 2 - tileHeight / 2);

        this.gameLevel.setVisibleArea(
            -viewContainer.x / viewContainer.scale.x as X,
            -viewContainer.y / viewContainer.scale.y as Y,
            canvas.width / viewContainer.scale.x,
            canvas.height / viewContainer.scale.y,
        );
    };

    private update = () => {
        const { x, y } = this.inputManager.getMovementIntent();

        if (x !== this.lastMovementIntent.x || y !== this.lastMovementIntent.y) {
            this.ws.send('command:move:' + x + ',' + y);
        }
        this.lastMovementIntent.x = x;
        this.lastMovementIntent.y = y;
        this.inputManager.clearPressedKeys();
        this.timer = requestAnimationFrame(this.update);
    };
}