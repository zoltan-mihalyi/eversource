import * as PIXI from 'pixi.js';
import { Position, X, Y } from '../../../common/domain/Location';
import { GameLevel } from './GameLevel';
import { InputManager, MovementIntent } from '../input/InputManager';
import { Diff } from '../../../common/protocol/Diff';
import { EntityData, EntityId } from '../../../common/domain/EntityData';
import { registerCursors } from '../display/Cursors';
import { PlayingNetworkApi, PlayingStateData } from '../protocol/PlayingState';
import { PlayerStateDiff } from '../../../common/protocol/Messages';

export class GameApplication extends PIXI.Application {
    private viewContainer = new PIXI.Container();
    private centerX = 0 as X;
    private centerY = 0 as Y;
    private timer: number;
    readonly inputManager: InputManager;
    private lastMovementIntent: MovementIntent = { x: 0, y: 0 };
    private entityId: EntityId | null = null;
    private gameLevel: GameLevel;

    constructor(data: PlayingStateData, private playingNetworkApi: PlayingNetworkApi) {
        super({ antialias: false });

        const { map, resources, position } = data;

        const gameLevel = new GameLevel(playingNetworkApi, map, resources);
        this.gameLevel = gameLevel;

        this.viewContainer.scale.x = map.map.tilewidth;
        this.viewContainer.scale.y = map.map.tileheight;

        this.timer = requestAnimationFrame(this.update);

        this.viewContainer.addChild(gameLevel.container);
        this.stage.addChild(this.viewContainer);

        this.setViewCenter(position);

        this.inputManager = new InputManager();

        registerCursors(this.renderer.plugins.interaction.cursorStyles);
    }

    destroy() {
        this.gameLevel.destroy();
        cancelAnimationFrame(this.timer);
        this.inputManager.destroy();
        super.destroy();
    }

    updateState(diffs: Diff<EntityId, EntityData>[]) {
        for (const diff of diffs) {
            if (diff.id === this.entityId) {
                if (diff.type === 'create') {
                    this.setViewCenter(diff.data.position);
                } else if (diff.type === 'change' && diff.changes.position) {
                    this.setViewCenter(diff.changes.position);
                }
            }
        }

        this.gameLevel.updateObjects(diffs);
    }

    updatePlayerState(state: PlayerStateDiff) {
        if (state.character && state.character.id !== void 0) {
            this.entityId = state.character.id;
            this.gameLevel.setEntityId(this.entityId);
        }
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

        const { tilewidth, tileheight } = this.gameLevel.map.map;

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
        const { x, y } = this.inputManager.getMovementIntent();

        if (x !== this.lastMovementIntent.x || y !== this.lastMovementIntent.y) {
            this.playingNetworkApi.move(x, y);
        }
        this.lastMovementIntent.x = x;
        this.lastMovementIntent.y = y;
        this.inputManager.clearPressedKeys();
        this.timer = requestAnimationFrame(this.update);
    };
}