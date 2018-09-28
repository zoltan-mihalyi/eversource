import { Map, NodeLoader, TileLayer, TmxObject } from '@eversource/tmx-parser';
import { ZoneId } from '../../../common/domain/Location';
import { Grid } from '../../../common/Grid';

export interface MapData {
    grid: Grid;
    objects: TmxObject[];
    tileWidth: number;
    tileHeight: number;
}

export interface MapLoader {
    load(zoneId: ZoneId): Promise<MapData>;
}

const tmxLoader = new NodeLoader();

export class TmxMapLoader implements MapLoader {
    constructor(private basePath: string) {
    }

    async load(zoneId: ZoneId): Promise<MapData> {
        const map = await this.loadMap(zoneId);
        return this.createMapData(map);
    }

    private loadMap(zoneId: ZoneId): Promise<Map> {
        return new Promise<Map>(((resolve, reject) => {
            tmxLoader.parseFile(this.zoneFileName(zoneId), (err, map) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(map as Map);
                }
            });
        }));
    }

    private createMapData(map: Map): MapData {
        const objects: TmxObject[] = [];
        for (const layer of map.layers) {
            if (layer.type === 'object') {
                objects.push(...layer.objects);
            }
        }

        return {
            tileWidth: map.tileWidth,
            tileHeight: map.tileHeight,
            grid: this.createGrid(map),
            objects,
        };
    }

    private createGrid(map: Map): Grid {
        const start = new Date();
        const { width, height, layers } = map;

        const baseLayer = layers.find(layer => layer.name === 'Base') as TileLayer;

        const data = baseLayer.tiles.map(tile => {
            return tile.terrain.find(terrain => terrain.properties.block) !== void 0;
        });

        const topLayer = layers.find(layer => layer.name === 'Top') as TileLayer | undefined;
        if (topLayer) {
            topLayer.tiles.forEach((tile, index) => {
                if (!(tile.properties as any).type) {
                    data[index] = true;
                }
            });
        }

        console.log(`Grid created in ${new Date().getTime() - start.getTime()} ms`);
        return new Grid(width, height, data);
    }

    private zoneFileName(zoneId: ZoneId): string {
        return `${this.basePath}/${zoneId}.xml`;
    }
}