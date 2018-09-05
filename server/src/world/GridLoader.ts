import { Map, NodeLoader, TileLayer } from '@eversource/tmx-parser';
import { ZoneId } from '../../../common/domain/Location';
import { SafeCallback } from '../../../common/util/SafeCallback';
import { Grid } from '../../../common/Grid';

const BLOCKS: { [name: string]: boolean } = {
    Lava: true,
    Hole_Black: true,
    Hole_Brown: true,
    Water: true,
    Water_Deep: true,
};

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
            return tile.terrain.find(terrain => BLOCKS[terrain.name]) !== void 0;
        });

        console.log(`Grid created in ${new Date().getTime() - start.getTime()} ms`);
        return new Grid(width, height, data);
    }

    private zoneFileName(zoneId: ZoneId): string {
        return `${this.basePath}/${zoneId}.xml`;

    }
}