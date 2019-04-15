import * as PIXI from 'pixi.js'
import { TexturedTileSet } from './TexturedTileset';
import { X, Y } from '../../../common/domain/Location';
import { TileMap } from '../../../common/tiled/interfaces';
import { LoadedMap, ResolvedTileLayer } from '../../../common/tiled/TiledResolver';

export class Chunk {
    readonly base: PIXI.Container = new PIXI.Container();
    readonly above: PIXI.Container = new PIXI.Container();

    constructor(loadedMap: LoadedMap, ts: TexturedTileSet[], readonly chunkX: X, readonly chunkY: Y, width: number, height: number) {
        const { map } = loadedMap;

        for (const container of [this.base, this.above]) {
            container.x = chunkX * map.tilewidth;
            container.y = chunkY * map.tileheight;
        }

        for (const layer of loadedMap.layers) {
            if (layer.type === 'tilelayer') {
                this.addLayerToContainers(map, ts, width, height, layer);
            }
        }
        cacheAsBitmapIfNotEmpty(this.base);
        cacheAsBitmapIfNotEmpty(this.above);
    }

    private addLayerToContainers(map: TileMap, ts: TexturedTileSet[], width: number, height: number, layer: ResolvedTileLayer) {
        for (let i = 0; i < width; i++) {
            for (let j = 0; j < height; j++) {
                let index = this.chunkX + i + ((this.chunkY + j) * map.width);
                const tile = layer.tiles[index];
                if (!tile) {
                    continue;
                }
                const tileSet = findTileset(tile.globalId, ts);
                const sprite = new PIXI.Sprite(tileSet.textures[tile.globalId - tileSet.firstGid]);
                sprite.x = i * map.tilewidth;
                sprite.y = j * map.tileheight;
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