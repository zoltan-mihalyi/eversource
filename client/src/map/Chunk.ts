import * as PIXI from 'pixi.js'
import { TexturedTileSet } from './TexturedTileset';
import { Map as TmxMap, TileLayer, Layer } from '@eversource/tmx-parser';
import { X, Y } from '../../../common/domain/Location';

export class Chunk extends PIXI.Container {
    private baseLayer: PIXI.Container;

    constructor(map: TmxMap, ts: TexturedTileSet[], readonly chunkX: X, readonly chunkY: Y, width: number, height: number) {
        super();
        this.x = chunkX;
        this.y = chunkY;
        this.scale.x = 1 / map.tileWidth;
        this.scale.y = 1 / map.tileHeight;

        let base;
        for (const layer of map.layers) {
            if (layer.type === 'tile' && layer.name === 'Base') {
                base = layer
            }
        }
        if (!base) {
            throw new Error('Base layer not found!');
        }
        this.baseLayer = this.addLayer(map, ts, width, height, base);
    }

    private addLayer(map: TmxMap, ts: TexturedTileSet[], width: number, height: number, layer: Layer): PIXI.Container {
        const layerContainer = new PIXI.Container();
        this.addChild(layerContainer);

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
                layerContainer.addChild(sprite);
            }
        }
        layerContainer.cacheAsBitmap = true;
        return layerContainer;
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