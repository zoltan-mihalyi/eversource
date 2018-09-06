import * as PIXI from 'pixi.js'
import { TexturedTileSet } from './TexturedTileset';
import { Layer, Map as TmxMap, TileLayer } from '@eversource/tmx-parser';
import { X, Y } from '../../../common/domain/Location';

export class Chunk {
    readonly base: PIXI.Container = new PIXI.Container();
    readonly above: PIXI.Container = new PIXI.Container();

    constructor(map: TmxMap, ts: TexturedTileSet[], readonly chunkX: X, readonly chunkY: Y, width: number, height: number) {

        for (const container of [this.base, this.above]) {
            container.x = chunkX;
            container.y = chunkY;
            container.scale.x = 1 / map.tileWidth;
            container.scale.y = 1 / map.tileHeight;
        }

        for (const layer of map.layers) {
            if (layer.type === 'tile') {
                this.addLayerToContainers(map, ts, width, height, layer);
            }
        }
        cacheAsBitmapIfNotEmpty(this.base);
        cacheAsBitmapIfNotEmpty(this.above);
    }

    private addLayerToContainers(map: TmxMap, ts: TexturedTileSet[], width: number, height: number, layer: Layer) {
        for (let i = 0; i < width; i++) {
            for (let j = 0; j < height; j++) {
                let index = this.chunkX + i + ((this.chunkY + j) * map.width);
                const tile = (layer as TileLayer).tiles[index];
                if (!tile) {
                    continue;
                }
                let tileSet = findTileset(tile.gid, ts);
                const sprite = new PIXI.Sprite(tileSet.textures[tile.gid! - tileSet.firstGid]);
                sprite.x = i * map.tileWidth;
                sprite.y = j * map.tileHeight;
                const container = (tile.properties as any).type === 'above' ? this.above : this.base;
                container.addChild(sprite);
            }
        }
    }
}

function findTileset(gid: number, tileSets: TexturedTileSet[]): TexturedTileSet {
    for (let i = tileSets.length - 1; i >= 0; i--) {
        const tileset = tileSets[i];
        if (tileset.firstGid <= gid) {
            return tileset;
        }
    }
    throw new Error('Tile not found');
}

function cacheAsBitmapIfNotEmpty(container: PIXI.Container) {
    if (container.children.length > 0) {
        container.cacheAsBitmap = true;
    }
}