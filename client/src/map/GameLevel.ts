import { Chunk } from './Chunk';
import { X, Y } from '../../../common/domain/Location';
import { Map as TmxMap } from '@eversource/tmx-parser';
import { TexturedTileSet } from './TexturedTileset';
import * as PIXI from 'pixi.js';
import { Opaque } from '../../../common/util/Opaque';
import ResourceDictionary = PIXI.loaders.ResourceDictionary;

const CHUNK_WIDTH = 16;
const CHUNK_HEIGHT = 16;

type ChunkPosition = Opaque<string, 'ChunkPosition'>;

export class GameLevel {
    readonly chunks = new Map<ChunkPosition, Chunk>();

    readonly visibleChunks = new Set<Chunk>();
    readonly container = new PIXI.Container();
    private readonly tileSet: TexturedTileSet[];

    constructor(readonly map: TmxMap, images: ResourceDictionary) {
        this.tileSet = map.tileSets.map(tileset => new TexturedTileSet(tileset, images));

        for (let chunkX = 0; chunkX < map.width; chunkX += CHUNK_WIDTH) {
            for (let chunkY = 0; chunkY <= map.height; chunkY += CHUNK_HEIGHT) {
                const chunk = new Chunk(this.map, this.tileSet, chunkX as X, chunkY as Y, CHUNK_WIDTH, CHUNK_HEIGHT);
                this.chunks.set(chunkPosition(chunkX as X, chunkY as Y), chunk);
            }
        }
    }

    setVisibleArea(x: X, y: Y, width: number, height: number) {
        const startX = Math.floor(x / CHUNK_WIDTH) * CHUNK_WIDTH;
        const endX = Math.floor((x + width) / CHUNK_WIDTH) * CHUNK_WIDTH;

        const startY = Math.floor(y / CHUNK_HEIGHT) * CHUNK_HEIGHT;
        const endY = Math.floor((y + height) / CHUNK_HEIGHT) * CHUNK_HEIGHT;

        this.visibleChunks.forEach((chunk: Chunk) => {
            if (chunk.chunkX < startX || chunk.chunkX > endX || chunk.chunkY < startY || chunk.chunkY > endY) {
                this.visibleChunks.delete(chunk);
                this.container.removeChild(chunk);
            }
        });

        for (let chunkX = startX; chunkX <= endX; chunkX += CHUNK_WIDTH) {
            for (let chunkY = startY; chunkY <= endY; chunkY += CHUNK_HEIGHT) {
                const chunk = this.chunks.get(chunkPosition(chunkX as X, chunkY as Y));
                if (!chunk) {
                    continue;
                }
                if (this.visibleChunks.has(chunk)) {
                    continue;
                }
                this.visibleChunks.add(chunk);
                this.container.addChild(chunk);
            }
        }
    }
}

function chunkPosition(x: X, y: Y): ChunkPosition {
    return (x / CHUNK_WIDTH) + ':' + (y / CHUNK_HEIGHT) as ChunkPosition;
}