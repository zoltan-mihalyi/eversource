import * as PIXI from 'pixi.js';
import { Rectangle, Texture } from 'pixi.js';
import { pixiLoader } from '../utils';
import { CancellableProcess } from '../../../common/util/CancellableProcess';
import { Palettes } from '../game/Palettes';
import { AsyncLoader, Request } from './AsyncLoader';
import { MultiColorReplaceFilter } from '@pixi/filter-multi-color-replace'
import { TileSet } from '../../../common/tiled/interfaces';
import { loadTileSet, mergeTileData } from '../../../common/tiled/TiledResolver';
import { SplitTextureSource } from '../texture/SplitTextureSource';
import { AnyRenderer, RecoloredAnimatedSprite } from '../texture/RecoloredAnimatedSprite';

interface Animations {
    [key: string]: Texture[];
}

const NO_OFFSET = { x: 0, y: 0 };

class TileSetDetails {
    readonly tileSet: TileSet;
    private animations = new Map<string, Rectangle[]>();
    private texturedAnimations = new Map<string, Animations>();

    constructor(private baseDir: string, tileSet: TileSet) {
        const { columns, tilewidth, tileheight } = tileSet;
        this.tileSet = tileSet;

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
            const splitTextureSource = new SplitTextureSource();

            animations = {};
            this.animations.forEach((animation, key) => {
                animations![key] = animation.map(rect => splitTextureSource.getTexture(rect));
            });

            this.texturedAnimations.set(image, animations);

            splitTextureSource.loadFrom(`${this.baseDir}/${image}.png`);
        }

        return animations;
    }
}

export class TextureLoader {
    private tileSetLoader = new TileSetDetailsLoader(this.process, this.baseDir);
    private palettesLoader = new PalettesLoader(this.process, this.baseDir);

    constructor(private renderer: AnyRenderer, private readonly process: CancellableProcess,
                private tileHeight: number, private baseDir = 'spritesheets') {
    }

    loadDetails(requestHolder: PIXI.Container, tileSet: string, callback: (details: TileSetDetails) => void) {
        addRequestToContainer(requestHolder, this.tileSetLoader.get(tileSet, callback));
    }

    createAnimatedSprite(image: string, animation: string): PIXI.extras.AnimatedSprite {
        return this.createCustomAnimatedSprite(image, image, animation, '');
    }

    createCustomAnimatedSprite(tileSet: string, image: string, animation: string,
                               palettesFile: string, color?: string): PIXI.extras.AnimatedSprite {

        const sprite = new RecoloredAnimatedSprite(this.renderer, [PIXI.Texture.EMPTY]);

        this.loadDetails(sprite, tileSet, (details: TileSetDetails) => {
            const { tileSet } = details;
            const tileoffset = tileSet.tileoffset || NO_OFFSET;
            sprite.anchor.set(
                -tileoffset.x / tileSet.tilewidth,
                1 - ((this.tileHeight + tileoffset.y) / tileSet.tileheight),
            );

            sprite.setRecolorTextures(details.getAnimations(image)[animation]);
            sprite.play();
        });

        if (color) {
            addRequestToContainer(sprite, this.palettesLoader.get(palettesFile, (palettes) => {
                sprite.setRecolor(palettes, color);
            }));
        }

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

interface RequestHolder extends PIXI.Container {
    _requests: Request[];
}

function addRequestToContainer(container: PIXI.Container, request: Request): void {
    let requests = (container as RequestHolder)._requests;
    if (!requests) {
        requests = [];
        (container as RequestHolder)._requests = requests;
    }

    requests.push(request);

    container.destroy = (options) => {
        container.constructor.prototype.destroy.call(container, options);
        for (const r of requests) {
            r.stop();
        }
    };
}
