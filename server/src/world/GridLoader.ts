import { Map, NodeLoader, TileLayer } from '@eversource/tmx-parser';
import { ZoneId } from '../../../common/domain/Location';
import { SafeCallback } from '../../../common/util/SafeCallback';
import { Grid } from '../../../common/Grid';

export interface GridLoader {
    load(zoneId: ZoneId, callback: SafeCallback<Grid>): void;
}

const tmxLoader = new NodeLoader();

export class TmxGridLoader implements GridLoader {
    constructor(private basePath: string) {
    }

    load(zoneId: ZoneId, callback: SafeCallback<Grid>) {
        tmxLoader.parseFile(this.zoneFileName(zoneId), (err, map) => {
            if (err) {
                callback(err);
            } else {
                callback(null, this.createGrid(map as Map));
            }
        });
    }

    private createGrid(map: Map): Grid {
        const start = new Date();
        const { width, height, layers } = map;

        const baseLayer = layers.find(layer => layer.name === 'Base') as TileLayer;

        const data = baseLayer.tiles.map(tile => {
            return tile.terrain.find(terrain => terrain.properties.block) !== void 0;
        });

        const topLayer = layers.find(layer => layer.name === 'Top') as TileLayer;
        topLayer.tiles.forEach((tile, index) => {
            if (!(tile.properties as any).type) {
                data[index] = true;
            }
        });

        console.log(`Grid created in ${new Date().getTime() - start.getTime()} ms`);
        return new Grid(width, height, data);
    }

    private zoneFileName(zoneId: ZoneId): string {
        return `${this.basePath}/${zoneId}.xml`;

    }
}