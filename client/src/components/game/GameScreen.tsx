import * as React from 'react';
import { GameApplication } from '../../map/GameApplication';

const PIXEL_RATIO = 2;

interface Props {
    game: GameApplication;
    enterCharacterSelection: () => void;
}

interface ImageStyle extends CSSStyleDeclaration {
    imageRendering: string;
}

export class GameScreen extends React.Component<Props> {
    private canvas: HTMLCanvasElement | null = null;

    render() {
        return (
            <div ref={this.containerRef}>
                <button onClick={this.props.enterCharacterSelection}>leave</button>
            </div>
        );
    }

    private initialize(container: HTMLElement) {
        const { game } = this.props;

        const canvas = game.view;
        this.canvas = canvas;
        canvas.addEventListener('contextmenu', this.onContextMenu);
        container.insertBefore(canvas, container.children[0]);

        const style = (canvas.style as ImageStyle);
        style.imageRendering = 'pixelated';
        style.imageRendering = 'crisp-edges';
        style.imageRendering = '-moz-crisp-edges';

        window.addEventListener('resize', this.updateSize);

        this.updateSize();
    }

    private cleanup() {
        this.canvas!.removeEventListener('contextmenu', this.onContextMenu);
        window.removeEventListener('resize', this.updateSize);
    }

    private containerRef = (container: HTMLElement | null) => {
        if (container) {
            this.initialize(container);
        } else {
            this.cleanup();
        }
    };

    private updateSize = () => {
        const { game } = this.props;
        const canvas = game.view;

        const height = window.innerHeight - 30;
        const canvasWidth = Math.floor(window.innerWidth / PIXEL_RATIO);
        const canvasHeight = Math.floor(height / PIXEL_RATIO);

        canvas.style.width = `${canvasWidth * PIXEL_RATIO}px`;
        canvas.style.height = `${canvasHeight * PIXEL_RATIO}px`;

        game.renderer.resize(canvasWidth, canvasHeight);
        game.updateView();
    };

    private onContextMenu = (event: Event) => {
        event.preventDefault();
    };
}
