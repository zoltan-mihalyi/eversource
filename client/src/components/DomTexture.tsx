import * as React from 'react';
import { HTMLAttributes } from 'react';

import { Texture } from 'pixi.js';
import BaseTexture = PIXI.BaseTexture;

interface Props extends HTMLAttributes<HTMLCanvasElement> {
    texture: Texture
}

interface Waiting {
    texture: BaseTexture;
    cb: (texture: BaseTexture) => void;
}

export class DomTexture extends React.PureComponent<Props> {
    private waiting: Waiting | null = null;
    private canvas: HTMLCanvasElement | null = null;

    render() {
        const { texture, ...rest } = this.props;

        return (
            <canvas ref={this.canvasRef} width={texture.width} height={texture.height} {...rest}/>
        );
    }

    componentDidUpdate(prevProps: Readonly<Props>) {
        if (this.props.texture !== prevProps.texture) {
            this.update();
        }
    }

    componentWillUnmount() {
        this.unregister();
    }

    private canvasRef = (canvas: HTMLCanvasElement) => {
        this.canvas = canvas;
        if (canvas) {
            this.update();
        }
    };

    private update() {
        const { texture } = this.props;
        this.unregister();

        if (texture.baseTexture.hasLoaded) {
            this.drawCanvas();
        } else {
            const cb = () => {
                this.waiting = null;
                this.drawCanvas()
            };
            texture.baseTexture.on('loaded', cb);
            this.waiting = {
                cb,
                texture: texture.baseTexture
            };
        }

    }

    private unregister() {
        if (this.waiting) {
            this.waiting.texture.off('loaded', this.waiting.cb);
        }
    }

    private drawCanvas() {
        const canvas = this.canvas!;
        const { texture } = this.props;
        const source = texture.baseTexture.source!;
        canvas.getContext('2d')!.drawImage(source, -texture.frame.left, -texture.frame.top);
    }
}
