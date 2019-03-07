import * as PIXI from 'pixi.js';
import { Position, X, Y } from '../../../common/domain/Location';
import { GameContext, GameLevel } from './GameLevel';
import { InputManager, MovementIntent } from '../input/InputManager';
import { registerCursors } from '../display/Cursors';
import { PlayingNetworkApi, PlayingStateData } from '../protocol/PlayingState';
import { TextureLoader } from './TextureLoader';
import { CancellableProcess } from '../../../common/util/CancellableProcess';
import { EventBus } from '../../../common/es/EventBus';
import { ClientEvents } from '../es/ClientEvents';
import { EntityContainer } from '../../../common/es/EntityContainer';
import { ClientComponents } from '../es/ClientComponents';
import { networkSystem } from '../systems/NetworkSystem';
import { cameraFollowSystem } from '../systems/CameraFollowSystem';
import { FragmentPosition, Metric } from '../systems/display/Metric';

export class GameApplication extends PIXI.Application {
    private viewContainer = new PIXI.Container();
    private center: FragmentPosition = { x: 0, y: 0 };
    readonly inputManager: InputManager;
    private lastMovementIntent: MovementIntent = { x: 0, y: 0 };
    private gameLevel: GameLevel;
    private readonly process = new CancellableProcess();
    readonly eventBus = new EventBus<ClientEvents>();
    private metric: Metric;

    constructor(data: PlayingStateData, private playingNetworkApi: PlayingNetworkApi) {
        super({ antialias: false });


        const { map, resources, position } = data;
        this.metric = new Metric(map.map.tilewidth, map.map.tileheight);

        const textureLoader = new TextureLoader(this.renderer, this.process, map.map.tileheight);
        const entityContainer = new EntityContainer<ClientComponents>();
        const gameContext: GameContext = {
            textureLoader,
            playingNetworkApi,
            metric: this.metric,
            entityContainer,
            eventBus: this.eventBus,
        };

        const gameLevel = new GameLevel(gameContext, map, resources);
        this.gameLevel = gameLevel;

        this.ticker.add(this.update);

        this.viewContainer.addChild(gameLevel.container);
        this.stage.addChild(this.viewContainer);

        this.setViewCenter(position);

        this.inputManager = new InputManager();

        registerCursors(this.renderer.plugins.interaction.cursorStyles);

        networkSystem(playingNetworkApi, entityContainer, this.eventBus);
        cameraFollowSystem(entityContainer, this.eventBus, (pos) => this.setViewCenter(pos));

    }

    setScale = (width: number, height: number, scale: number) => {
        this.metric.scale = scale;
        this.viewContainer.scale.set(scale);

        this.renderer.resize(width, height);
        this.updateViewport();
    };

    destroy() {
        this.process.stop();
        this.inputManager.destroy();
        super.destroy();
    }

    private setViewCenter(position: Position) {
        this.center = this.metric.toFragmentPosition(position);
        this.updateViewport();
    }


    private updateViewport() {
        const viewContainer = this.viewContainer;
        const canvas = this.view;

        const { tilewidth, tileheight } = this.gameLevel.map.map;

        viewContainer.x = -this.center.x * viewContainer.scale.x + Math.floor(canvas.width / 2);
        viewContainer.y = -this.center.y * viewContainer.scale.y + Math.floor(canvas.height / 2);

        this.gameLevel.setVisibleArea(
            -viewContainer.x / tilewidth / viewContainer.scale.x as X,
            -viewContainer.y / tileheight / viewContainer.scale.y as Y,
            canvas.width / tilewidth / viewContainer.scale.x,
            canvas.height / tileheight / viewContainer.scale.y,
        );
    };

    private update = () => {
        this.eventBus.emit('render', void 0);

        const { x, y } = this.inputManager.getMovementIntent();

        if (x !== this.lastMovementIntent.x || y !== this.lastMovementIntent.y) {
            this.playingNetworkApi.move(x, y);
        }
        this.lastMovementIntent.x = x;
        this.lastMovementIntent.y = y;
        this.inputManager.clearPressedKeys();
    };
}
