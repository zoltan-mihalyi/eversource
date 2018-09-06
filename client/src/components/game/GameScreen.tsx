import * as React from 'react';
import * as PIXI from 'pixi.js';
import { GameLevel } from '../../map/GameLevel';
import { Location, X, Y } from '../../../../common/domain/Location';

const PIXEL_RATIO = 2;

interface Props {
    gameLevel: GameLevel;
    location: Location;
    enterCharacterSelection: () => void;
}

interface ImageStyle extends CSSStyleDeclaration {
    imageRendering: string;
}

export class GameScreen extends React.Component<Props> {
    private timer: number | null = null;
    private app: PIXI.Application | null = null;
    private viewContainer = new PIXI.Container();
    private centerX = 0 as X;
    private centerY = 0 as Y;

    render() {
        return (
            <div>
                <canvas ref={this.canvasRef}/>
                <button onClick={this.props.enterCharacterSelection}>leave</button>
            </div>
        );
    }

    private initialize(canvas: HTMLCanvasElement) {
        const { location, gameLevel } = this.props;

        const style = (canvas.style as ImageStyle);
        style.imageRendering = 'pixelated';
        style.imageRendering = 'crisp-edges';
        style.imageRendering = '-moz-crisp-edges';

        this.app = new PIXI.Application({ view: canvas });
        this.viewContainer.scale.x = gameLevel.map.tileWidth;
        this.viewContainer.scale.y = gameLevel.map.tileHeight;

        window.addEventListener('resize', this.updateSize);

        this.timer = requestAnimationFrame(this.update);

        this.viewContainer.addChild(gameLevel.container);
        this.app.stage.addChild(this.viewContainer);

        this.setViewCenter(location.x, location.y);

        this.updateSize();
    }

    private cleanup() {
        this.app!.destroy();
        cancelAnimationFrame(this.timer!);
        window.removeEventListener('resize', this.updateSize);
    }

    private setViewCenter(x: X, y: Y) {
        this.centerX = x;
        this.centerY = y;

        this.updateView();
    }

    private canvasRef = (canvas: HTMLCanvasElement | null) => {
        if (canvas) {
            this.initialize(canvas);
        } else {
            this.cleanup();
        }
    };

    private updateSize = () => {
        const app = this.app!;
        const canvas = app.view;

        const height = window.innerHeight - 30;
        const canvasWidth = Math.floor(window.innerWidth / PIXEL_RATIO);
        const canvasHeight = Math.floor(height / PIXEL_RATIO);

        canvas.style.width = `${canvasWidth * PIXEL_RATIO}px`;
        canvas.style.height = `${canvasHeight * PIXEL_RATIO}px`;

        app.renderer.resize(canvasWidth, canvasHeight);
        this.updateView();
    };

    private updateView = () => {
        const viewContainer = this.viewContainer;
        const canvas = this.app!.view;

        viewContainer.x = Math.floor(-this.centerX * viewContainer.scale.x + canvas.width / 2);
        viewContainer.y = Math.floor(-this.centerY * viewContainer.scale.y + canvas.height / 2);

        this.props.gameLevel.setVisibleArea(
            -viewContainer.x / viewContainer.scale.x as X,
            -viewContainer.y / viewContainer.scale.y as Y,
            canvas.width / viewContainer.scale.x,
            canvas.height / viewContainer.scale.y,
        );
    };

    private update = () => {
        let newX = this.centerX + 0.1;
        if (newX > 140) {
            newX = 80;
        }
        this.setViewCenter(newX as X, this.centerY);

        this.timer = requestAnimationFrame(this.update);
    };
}
