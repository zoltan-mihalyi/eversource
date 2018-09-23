import * as PIXI from 'pixi.js';
import { BaseTexture, Rectangle, Texture } from 'pixi.js';
import { Loader, TileSet } from '@eversource/tmx-parser';
import { pixiLoader } from '../utils';
import { CancellableProcess } from '../../../common/util/CancellableProcess';
import { Palettes } from '../game/Palettes';
import { AsyncLoader } from './AsyncLoader';
import { MultiColorReplaceFilter } from '@pixi/filter-multi-color-replace'

interface Animations {
    [key: string]: Texture[];
}

class TileSetDetails {
    private animations = new Map<string, Rectangle[]>();
    private texturedAnimations = new Map<string, Animations>();

    constructor(private baseDir: string, tileSet: TileSet) {
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
            const baseTexture = BaseTexture.fromImage(`${this.baseDir}/${image}.png`);

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
    private tileSetLoader = new TileSetDetailsLoader(this.process, this.baseDir);
    private palettesLoader = new PalettesLoader(this.process, this.baseDir);

    private tileSetDetails = new Map<string, TileSetDetails>();
    private loadingTileSets = new Map<string, Set<(details: TileSetDetails) => void>>();

    constructor(private readonly process: CancellableProcess, private baseDir = 'spritesheets') {
    }

    createAnimatedSprite(image: string, name: string): PIXI.extras.AnimatedSprite {
        return this.createCustomAnimatedSprite(image, image, name, '');
    }

    createCustomAnimatedSprite(tileSet: string, image: string, name: string,
                               palettesFile: string, color?: string): PIXI.extras.AnimatedSprite {

        const sprite = new PIXI.extras.AnimatedSprite([Texture.EMPTY]);

        const tileSetReq = this.tileSetLoader.get(tileSet, (details: TileSetDetails) => {
            sprite.textures = details.getAnimations(image)[name];
            sprite.play();
        });
        const palettesReq = !color ? null : this.palettesLoader.get(palettesFile!, (palettes) => {
            const palette = palettes.variations[color];
            sprite.filters = [new MultiColorReplaceFilter(
                palettes.base.map((baseColorInfo, i) => [string2hex(baseColorInfo.color), string2hex(palette[i])]),
            )];
        });
        sprite.destroy = (options) => {
            PIXI.extras.AnimatedSprite.prototype.destroy.call(sprite, options);
            tileSetReq.stop();
            if (palettesReq) {
                palettesReq.stop();
            }
        };

        return sprite;
    }
}

abstract class AbstractLoader<T> extends AsyncLoader<T> {
    constructor(protected process: CancellableProcess, protected baseDir: string) {
        super();
    }
}

class TileSetDetailsLoader extends AbstractLoader<TileSetDetails> {
    protected load(tileSet: string, cb: (details: TileSetDetails) => void) {
        new Loader(pixiLoader).parseFile(`${this.baseDir}/${tileSet}.xml`, this.process.run((error, result) => {
            if (error) {
                throw error;
            }
            const details = new TileSetDetails(this.baseDir, result as TileSet);
            cb(details);
        }));
    }
}

class PalettesLoader extends AbstractLoader<Palettes> {
    protected load(key: string, cb: (paletes: Palettes) => void): void {
        pixiLoader(`${this.baseDir}/${key}/palettes.json`, (err, data) => {
            if (err) {
                throw err;
            }
            cb(JSON.parse(data));
        })
    }
}

function string2hex(color: string): number {
    return parseInt(color.substring(1), 16);
}