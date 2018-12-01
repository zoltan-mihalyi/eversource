import { BaseTexture, Rectangle, Texture } from 'pixi.js';
import { TaskQueue } from './TaskQueue';
import { loadImages } from './ImageLoader';

const SPLIT_W = 512;
const SPLIT_H = 512;

export const taskQueue = new TaskQueue(2);

export class SplitBaseTexture extends BaseTexture {
    constructor(readonly x: number, readonly y: number) {
        super();
        this.mipmap = false;
    }

    loadLater(source: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement) {
        taskQueue.enqueue(() => {
            super.loadSource(source);
        });
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
        const baseTextures: SplitBaseTexture[] = Array.from(this.baseTextures.values());

        loadImages(src, SPLIT_W, SPLIT_H, baseTextures);
    }
}