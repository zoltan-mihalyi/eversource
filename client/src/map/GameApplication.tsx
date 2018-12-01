import * as PIXI from 'pixi.js';
import { Position, X, Y } from '../../../common/domain/Location';
import { GameLevel } from './GameLevel';
import { InputManager, MovementIntent } from '../input/InputManager';
import { Diff } from '../../../common/protocol/Diff';
import { EntityData, EntityId } from '../../../common/domain/EntityData';
import { registerCursors } from '../display/Cursors';
import { PlayingNetworkApi, PlayingStateData } from '../protocol/PlayingState';
import { PlayerStateDiff } from '../../../common/protocol/Messages';
import { TextureLoader } from './TextureLoader';
import { CancellableProcess } from '../../../common/util/CancellableProcess';

export class GameApplication extends PIXI.Application {
    private viewContainer = new PIXI.Container();
    private centerX = 0 as X;
    private centerY = 0 as Y;
    private timer: number;
    readonly inputManager: InputManager;
    private lastMovementIntent: MovementIntent = { x: 0, y: 0 };
    private entityId: EntityId | null = null;
    private gameLevel: GameLevel;
    private readonly process = new CancellableProcess();

    constructor(data: PlayingStateData, private playingNetworkApi: PlayingNetworkApi) {
        super({ antialias: false });

        const { map, resources, position } = data;

        const textureLoader = new TextureLoader(this.renderer, this.process, map.map.tileheight);
        const gameContext = { textureLoader, playingNetworkApi };
        const gameLevel = new GameLevel(gameContext, map, resources);
        this.gameLevel = gameLevel;

        this.timer = requestAnimationFrame(this.update);

        this.viewContainer.addChild(gameLevel.container);
        this.stage.addChild(this.viewContainer);

        this.setViewCenter(position);

        this.inputManager = new InputManager();

        registerCursors(this.renderer.plugins.interaction.cursorStyles);
    }

    setScale(scale: number) {
        this.gameLevel.setScale(scale);
        this.viewContainer.scale.set(scale);
    }

    destroy() {
        this.process.stop();
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

        viewContainer.x = -this.centerX * tilewidth * viewContainer.scale.x + Math.floor(canvas.width / 2);
        viewContainer.y = -this.centerY * tileheight * viewContainer.scale.y + Math.floor(canvas.height / 2);

        this.gameLevel.setVisibleArea(
            -viewContainer.x / tilewidth / viewContainer.scale.x as X,
            -viewContainer.y / tileheight / viewContainer.scale.y as Y,
            canvas.width / tilewidth / viewContainer.scale.x,
            canvas.height / tileheight / viewContainer.scale.y,
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