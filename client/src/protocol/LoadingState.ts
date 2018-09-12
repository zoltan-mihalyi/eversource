import { NetworkingState } from './NetworkingState';
import { Loader, Map, TileSet } from '@eversource/tmx-parser';
import { cleanupTextures, pixiLoader } from '../utils';
import * as PIXI from "pixi.js";
import * as path from "path";
import { GameLevel } from '../map/GameLevel';
import { Location } from '../../../common/domain/Location';
import { PlayingState } from './PlayingState';

const basePath = './dist/maps';

export class LoadingState extends NetworkingState<Location> {
    private gameLevel: GameLevel | null = null;
    private aborted = false;
    private textureLoader = new PIXI.loaders.Loader();

    onEnter() {
        const { zoneId } = this.data;

        this.context.display.showLoading(zoneId);

        new Loader(pixiLoader).parseFile(`${basePath}/${zoneId}.xml`, (err: any, map?: Map | TileSet) => {
            if (this.aborted) {
                return;
            }

            for (const tileSet of (map as Map).tileSets) {
                this.textureLoader.add(tileSet.image!.source, path.join(basePath, path.dirname(tileSet.source), tileSet.image!.source));
            }

            this.textureLoader.load(() => {
                if (this.aborted) {
                    cleanupTextures();
                    return;
                }
                this.gameLevel = new GameLevel(map as Map, this.textureLoader.resources);
                this.context.ws.send('ready');
            });
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