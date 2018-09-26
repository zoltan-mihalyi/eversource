import * as pako from 'pako';
import { ZoneId } from '../../../common/domain/Location';
import { Grid } from '../../../common/Grid';
import { TiledObject } from '../../../common/tiled/interfaces';
import * as fs from 'fs';
import { LoadedMap, loadMap, ResolvedTileLayer } from '../../../common/tiled/TiledResolver';

export interface MapData {
    grid: Grid;
    objects: TiledObject[];
    tileWidth: number;
    tileHeight: number;
}

export interface MapLoader {
    load(zoneId: ZoneId): Promise<MapData>;
}

function readFile(file: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        fs.readFile(file, 'utf-8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

function base64Inflate(b64string: string): Uint8Array {
    return pako.inflate(Buffer.from(b64string, 'base64'));
}

export class TmxMapLoader implements MapLoader {
    constructor(private basePath: string) {
    }

    async load(zoneId: ZoneId): Promise<MapData> {
        const map = await loadMap(this.zoneFileName(zoneId), readFile, base64Inflate);
        return this.createMapData(map);
    }

    private createMapData(loadedMap: LoadedMap): MapData {
        const { map } = loadedMap;
        const objects: TiledObject[] = [];
        for (const layer of map.layers) {
            if (layer.type === 'objectgroup') {
                objects.push(...layer.objects);
            }
        }

        return {
            tileWidth: map.tilewidth,
            tileHeight: map.tileheight,
            grid: this.createGrid(loadedMap),
            objects,
        };
    }

    private createGrid(loadedMap: LoadedMap): Grid {
        const start = new Date();
        const { map, layers } = loadedMap;
        const { width, height } = map;

        const baseLayer = layers.find(layer => layer.name === 'Base') as ResolvedTileLayer;

        const data = baseLayer.tiles.map(tile => {
            return (tile && tile.terrain && tile.terrain.find(terrain => !!terrain.properties.block)) !== void 0;
        });

        const topLayer = layers.find(layer => layer.name === 'Top') as ResolvedTileLayer | undefined;
        if (topLayer) {
            topLayer.tiles.forEach((tile, index) => {
                if (tile && !(tile.properties).type) {
                    data[index] = true;
                }
            });
        }

        console.log(`Grid created in ${new Date().getTime() - start.getTime()} ms`);
        return new Grid(width, height, data);
    }

    private zoneFileName(zoneId: ZoneId): string {
        return `${this.basePath}/${zoneId}.json`;
    }
}