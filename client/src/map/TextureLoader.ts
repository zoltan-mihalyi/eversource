import * as PIXI from 'pixi.js';
import { BaseTexture, Rectangle, Texture } from 'pixi.js';
import { Loader, TileSet } from '@eversource/tmx-parser';
import { pixiLoader } from '../utils';
import { CancellableProcess } from '../../../common/util/CancellableProcess';

interface Animations {
    [key: string]: Texture[];
}

class TileSetDetails {
    private animations = new Map<string, Rectangle[]>();
    private texturedAnimations = new Map<string, Animations>();

    constructor(tileSet: TileSet) {
        const { image, tiles, tileWidth, tileHeight } = tileSet;

        const columns = image!.width / tileWidth; // TODO offset, margin

        tiles.forEach((tile, index) => {
            if (!tile) {
                return;
            }
            const name = (tile.properties as any).name;
            if (!name) {
                return;
            }

            const tileAnimations = tile.animations.length === 0 ?
                [tileFrame(index)] :
                tile.animations.map(anim => tileFrame(anim.tileId));

            this.animations.set(name, tileAnimations);
        });

        function tileFrame(index: number): Rectangle {
            const x = index % columns;
            const y = Math.floor(index / columns);
            return new Rectangle(x * tileWidth, y * tileHeight, tileWidth, tileHeight);
        }
    }

    getAnimations(image: string): Animations {
        let animations = this.texturedAnimations.get(image);
        if (!animations) {
            const baseTexture = BaseTexture.fromImage(`spritesheets/${image}.png`);

            animations = {};
            this.animations.forEach((animation, key) => {
                animations![key] = animation.map(rect => new Texture(baseTexture, rect));
            });

            this.texturedAnimations.set(image, animations);

        }

        return animations;
    }
}

export class TextureLoader {
    private tileSetDetails = new Map<string, TileSetDetails>();
    private loadingTileSets = new Map<string, Set<(details: TileSetDetails) => void>>();

    constructor(private readonly process: CancellableProcess) {
    }

    createAnimatedSprite(image: string, name: string): PIXI.extras.AnimatedSprite {
        return this.createCustomAnimatedSprite(image, image, name);
    }

    createCustomAnimatedSprite(tileSet: string, image: string, name: string): PIXI.extras.AnimatedSprite {
        const sprite = new PIXI.extras.AnimatedSprite([Texture.EMPTY]);

        const cb = (details: TileSetDetails) => {
            sprite.textures = details.getAnimations(image)[name];
            sprite.play();
        };
        sprite.destroy = (options) => {
            PIXI.extras.AnimatedSprite.prototype.destroy.call(sprite, options);
            const loading = this.loadingTileSets.get(tileSet);
            if (loading) {
                loading.delete(cb);
            }
        };

        this.getTileSetDetails(tileSet, cb);

        return sprite;
    }

    private getTileSetDetails(tileSet: string, cb: (details: TileSetDetails) => void) {
        const details = this.tileSetDetails.get(tileSet);
        if (details) {
            cb(details);
            return;
        }
        let callbacks = this.loadingTileSets.get(tileSet);
        if (callbacks) {
            callbacks.add(cb);
            return;
        }
        callbacks = new Set<(details: TileSetDetails) => void>([cb]);
        this.loadingTileSets.set(tileSet, callbacks);

        new Loader(pixiLoader).parseFile(`spritesheets/${tileSet}.xml`, this.process.run((error, result) => {
            if (error) {
                throw error;
            }
            const details = new TileSetDetails(result as TileSet);
            this.tileSetDetails.set(tileSet, details);
            this.loadingTileSets.delete(tileSet);

            callbacks!.forEach(callback => callback(details));
        }));
    }
}
