import * as PIXI from 'pixi.js';
import { BaseTexture, Rectangle, Texture } from 'pixi.js';
import { pixiLoader } from '../utils';
import { CancellableProcess } from '../../../common/util/CancellableProcess';
import { Palettes } from '../game/Palettes';
import { AsyncLoader } from './AsyncLoader';
import { MultiColorReplaceFilter } from '@pixi/filter-multi-color-replace'
import { TileSet } from '../../../common/tiled/interfaces';
import { loadTileSet, mergeTileData } from '../../../common/tiled/TiledResolver';

interface Animations {
    [key: string]: Texture[];
}

class TileSetDetails {
    private animations = new Map<string, Rectangle[]>();
    private texturedAnimations = new Map<string, Animations>();

    constructor(private baseDir: string, tileSet: TileSet) {
        const { columns, tilewidth, tileheight } = tileSet;

        const tiles = mergeTileData(tileSet);

        for (const tileId of Object.keys(tiles)) {
            const tile = tiles[+tileId]!;
            const name = tile.properties.name;
            if (typeof name !== 'string') {
                continue;
            }
            const tileAnimations = tile.animation ?
                tile.animation.map(anim => tileFrame(anim.tileid)) :
                [tileFrame(+tileId)];

            this.animations.set(name, tileAnimations);
        }

        function tileFrame(index: number): Rectangle {
            const x = index % columns;
            const y = Math.floor(index / columns);
            return new Rectangle(x * tilewidth, y * tileheight, tilewidth, tileheight);
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
        loadTileSet(pixiLoader, `${this.baseDir}/${tileSet}.json`).then(this.process.run((result) => {
            cb(new TileSetDetails(this.baseDir, result));
        }));
    }
}

class PalettesLoader extends AbstractLoader<Palettes> {
    protected load(key: string, cb: (paletes: Palettes) => void): void {
        pixiLoader(`${this.baseDir}/${key}/palettes.json`).then(this.process.run(result => {
            cb(JSON.parse(result));
        }));
    }
}

function string2hex(color: string): number {
    return parseInt(color.substring(1), 16);
}