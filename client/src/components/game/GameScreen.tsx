import * as React from 'react';
import { GameApplication } from '../../map/GameApplication';
import { Button } from '../gui/Button';
import { PlayingNetworkApi } from '../../protocol/PlayingState';

interface Props {
    game: GameApplication;
    onMount: (gameScreen: GameScreen) => void;
    playingNetworkApi: PlayingNetworkApi;
}

interface ImageStyle extends CSSStyleDeclaration {
    imageRendering: string;
}

export class GameScreen extends React.Component<Props> {
    private canvas: HTMLCanvasElement | null = null;

    render() {
        return (
            <div>
                <div ref={this.containerRef}/>
                <div className="gui bottom">
                    <Button onClick={this.leave}>Leave</Button>
                </div>
                <div ref={this.joystickContainerRef}/>
            </div>
        );
    }

    componentDidMount() {
        this.props.onMount(this);
    }

    private joystickContainerRef = (div: HTMLDivElement | null) => {
        const { inputManager } = this.props.game;
        if (div) {
            inputManager.initializeJoystick(div);
        }
    };

    private initialize(container: HTMLElement) {
        const { game } = this.props;

        const canvas = game.view;
        this.canvas = canvas;
        canvas.addEventListener('contextmenu', this.onContextMenu);
        container.appendChild(canvas);

        const style = (canvas.style as ImageStyle);
        style.position = 'fixed';
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

        const width = window.innerWidth;
        const height = window.innerHeight;

        const widthRatio = width / 800;
        const heightRatio = height / 600;

        const pixelRatio = restrict((widthRatio + heightRatio) / 2, 1, 2);

        const canvasWidth = Math.floor(width / pixelRatio);
        const canvasHeight = Math.floor(height / pixelRatio);

        canvas.style.width = `${canvasWidth * pixelRatio}px`;
        canvas.style.height = `${canvasHeight * pixelRatio}px`;

        game.renderer.resize(canvasWidth, canvasHeight);
        game.updateView();
    };

    private onContextMenu = (event: Event) => {
        event.preventDefault();
    };

    private leave = () => {
        this.props.playingNetworkApi.leaveGame();
    };
}

function restrict(num: number, start: number, end: number): number {
    if (num < start) {
        return start;
    }
    if (num > end) {
        return end;
    }
    return num;
}