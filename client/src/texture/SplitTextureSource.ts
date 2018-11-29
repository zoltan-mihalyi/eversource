import { BaseTexture, Rectangle, Texture } from 'pixi.js';
import { TaskQueue } from './TaskQueue';

const SPLIT_W = 256;
const SPLIT_H = 256;

const taskQueue = new TaskQueue(8);

class SplitBaseTexture extends BaseTexture {
    constructor(private x: number, private y: number) {
        super();
    }

    imageLoaded(img: HTMLImageElement) {
        const canvas = document.createElement('canvas') as HTMLCanvasElement;
        canvas.width = SPLIT_W;
        canvas.height = SPLIT_H;

        const ctx = canvas.getContext('2d')!;

        ctx.drawImage(img, this.x * SPLIT_W, this.y * SPLIT_H, SPLIT_W, SPLIT_H, 0, 0, SPLIT_W, SPLIT_H);

        taskQueue.enqueue(() => this.loadSource(canvas));
    }
}

//TODO change loadFrom to constructor and creating baseTexture after load should also work
export class SplitTextureSource {
    private baseTextures = new Map<number, SplitBaseTexture>();

    getTexture(rect: Rectangle): Texture {
        const tx = Math.floor(rect.left / SPLIT_W);
        const ty = Math.floor(rect.top / SPLIT_H);
        const key = tx * 256 + ty;

        let baseTexture = this.baseTextures.get(key);
        if (baseTexture === void 0) {
            baseTexture = new SplitBaseTexture(tx, ty);

            this.baseTextures.set(key, baseTexture);
        }

        return new Texture(baseTexture, new Rectangle(rect.left - tx * SPLIT_W, rect.top - ty * SPLIT_H, rect.width, rect.height));
    }

    loadFrom(src: string) {
        const img = document.createElement('img') as HTMLImageElement;
        img.src = src;
        img.onload = () => { // TODO destroy callback on end
            this.baseTextures.forEach((baseTexture) => baseTexture.imageLoaded(img));
        };
    }
}