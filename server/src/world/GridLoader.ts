import { Map, NodeLoader, TileLayer } from '@eversource/tmx-parser';
import { ZoneId } from '../../../common/domain/Location';
import { Grid } from '../../../common/Grid';

export interface GridLoader {
    load(zoneId: ZoneId): Promise<Grid>;
}

const tmxLoader = new NodeLoader();

export class TmxGridLoader implements GridLoader {
    constructor(private basePath: string) {
    }

    async load(zoneId: ZoneId): Promise<Grid> {
        const map = await this.loadMap(zoneId);
        return this.createGrid(map);
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

    private createGrid(map: Map): Grid {
        const start = new Date();
        const { width, height, layers } = map;

        const baseLayer = layers.find(layer => layer.name === 'Base') as TileLayer;

        const data = baseLayer.tiles.map(tile => {
            return tile.terrain.find(terrain => terrain.properties.block) !== void 0;
        });

        const topLayer = layers.find(layer => layer.name === 'Top') as TileLayer;
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