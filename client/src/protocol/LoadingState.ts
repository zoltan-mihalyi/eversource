import { NetworkingState } from './NetworkingState';
import { cleanupTextures, pixiLoader } from '../utils';
import * as PIXI from 'pixi.js';
import * as path from 'path';
import * as pako from 'pako';
import { Location } from '../../../common/domain/Location';
import { PlayingState } from './PlayingState';
import { LoadedMap, loadMap } from '../../../common/tiled/TiledResolver';

const basePath = './dist/maps';

export class LoadingState extends NetworkingState<Location> {
    private map: LoadedMap | null = null;
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
            this.map = map;
            this.context.connection.send('ready');
        });
    }

    ready() {
        const { map } = this;
        if (map) {
            const { position } = this.data;
            this.manager.enter(PlayingState, {
                position,
                map,
                resources: this.textureLoader.resources,
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