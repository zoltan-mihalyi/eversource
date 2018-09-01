import * as React from 'react';

interface Props {
    enterCharacterSelection: () => void;
}

export class GameScreen extends React.Component<Props> {
    private timer: any = null;

    render() {
        return (
            <div>
                <canvas ref={this.canvasRef}/>
                <button onClick={this.props.enterCharacterSelection}>leave</button>
            </div>
        );
    }

    private canvasRef = (canvas: HTMLCanvasElement | null) => {
        if (canvas) {
            const ctx = canvas.getContext('2d')!;
            this.timer = setInterval(() => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = "#FF0000";
                ctx.fillRect(Math.random() * 100, 0, 150, 75);
            }, 100);
        } else {
            clearInterval(this.timer);
        }
    };
}
