import { NetworkingState } from './NetworkingState';
import { cleanupTextures, pixiLoader } from '../utils';
import * as PIXI from 'pixi.js';
import * as path from 'path';
import * as pako from 'pako';
import { GameLevel } from '../map/GameLevel';
import { Location } from '../../../common/domain/Location';
import { PlayingState } from './PlayingState';
import { loadMap } from '../../../common/tiled/TiledResolver';

const basePath = './dist/maps';

export class LoadingState extends NetworkingState<Location> {
    private gameLevel: GameLevel | null = null;
    private aborted = false;
    private textureLoader = new PIXI.loaders.Loader();

    async onEnter() {
        const { zoneId } = this.data;

        this.context.display.showLoading(zoneId);

        const map = await loadMap(`${basePath}/${zoneId}.json`, pixiLoader, base64Inflate);
        if (this.aborted) {
            return;
        }

        for (const tileSet of map.tileSets) {
            this.textureLoader.add(tileSet.image, path.join(basePath, path.dirname(tileSet.source), tileSet.image));
        }
        this.textureLoader.load(() => {
            if (this.aborted) {
                cleanupTextures();
                return;
            }
            this.gameLevel = new GameLevel(map, this.textureLoader.resources);
            this.context.ws.send('ready');
        });
    }

    ready() {
        if (this.gameLevel) {
            const { position } = this.data;
            this.manager.enter(PlayingState, {
                position,
                gameLevel: this.gameLevel,
            });
        }
    }

    protected abort() {
        this.aborted = true;
        this.textureLoader.destroy();
        cleanupTextures();
    }
}

function base64Inflate(base64str: string): Uint8Array {
    return pako.inflate(atob(base64str));
}