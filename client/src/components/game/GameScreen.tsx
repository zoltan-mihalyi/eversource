import * as React from 'react';
import {GameLevel} from '../../map/GameLevel';
import {Location} from '../../../../common/domain/Location';
import {GameApplication} from '../../map/GameApplication';

const PIXEL_RATIO = 2;

interface Props {
    gameLevel: GameLevel;
    location: Location;
    enterCharacterSelection: () => void;
    ws: WebSocket;
}

interface ImageStyle extends CSSStyleDeclaration {
    imageRendering: string;
}

export class GameScreen extends React.Component<Props> {
    private app: GameApplication | null = null;

    render() {
        return (
            <div>
                <canvas ref={this.canvasRef}/>
                <button onClick={this.props.enterCharacterSelection}>leave</button>
            </div>
        );
    }

    private initialize(canvas: HTMLCanvasElement) {
        const {location, gameLevel, ws} = this.props;

        const style = (canvas.style as ImageStyle);
        style.imageRendering = 'pixelated';
        style.imageRendering = 'crisp-edges';
        style.imageRendering = '-moz-crisp-edges';

        this.app = new GameApplication(canvas, gameLevel, location, ws);

        window.addEventListener('resize', this.updateSize);

        this.updateSize();
    }

    private cleanup() {
        this.app!.destroy();
        window.removeEventListener('resize', this.updateSize);
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
        app.updateView();
    };

}
