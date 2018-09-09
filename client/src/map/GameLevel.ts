import { Chunk } from './Chunk';
import { X, Y } from '../../../common/domain/Location';
import { Map as TmxMap } from '@eversource/tmx-parser';
import { TexturedTileSet } from './TexturedTileset';
import * as PIXI from 'pixi.js';
import { Opaque } from '../../../common/util/Opaque';
import { Direction, GameObject, Position } from '../../../common/GameObject';
import { TextureLoader } from './TextureLoader';
import ResourceDictionary = PIXI.loaders.ResourceDictionary;

const CHUNK_WIDTH = 16;
const CHUNK_HEIGHT = 16;

type ChunkPosition = Opaque<string, 'ChunkPosition'>;

const textureLoader = new TextureLoader();

export class GameLevel {
    readonly chunks = new Map<ChunkPosition, Chunk>();

    readonly visibleChunks = new Set<Chunk>();
    readonly container = new PIXI.Container();
    readonly chunkContainer = new PIXI.Container();
    readonly objectContainer = new PIXI.Container();
    private readonly tileSet: TexturedTileSet[];

    constructor(readonly map: TmxMap, images: ResourceDictionary) {
        this.tileSet = map.tileSets.map(tileset => new TexturedTileSet(tileset, images));
        this.container.addChild(this.chunkContainer);
        this.container.addChild(this.objectContainer);

        for (let chunkX = 0; chunkX < map.width; chunkX += CHUNK_WIDTH) {
            for (let chunkY = 0; chunkY <= map.height; chunkY += CHUNK_HEIGHT) {
                const chunk = new Chunk(this.map, this.tileSet, chunkX as X, chunkY as Y, CHUNK_WIDTH, CHUNK_HEIGHT);
                this.chunks.set(chunkPosition(chunkX as X, chunkY as Y), chunk);
            }
        }
    }

    updateObjects(objects: GameObject[]) {
        this.objectContainer.removeChildren();

        const { tileWidth, tileHeight } = this.map;

        for (const object of objects) {
            const { x, y } = this.round(object.position);

            const character = new PIXI.Container();
            character.x = x - 16 / tileWidth; // TODO read from file?
            character.y = y - 32 / tileHeight;
            character.scale.x = 1 / tileWidth;
            character.scale.y = 1 / tileHeight;

            const shadow = new PIXI.Sprite(textureLoader.get('misc', 'shadow'));
            shadow.blendMode = PIXI.BLEND_MODES.MULTIPLY;
            shadow.x = 16;
            shadow.y = 32 + 6;
            character.addChild(shadow);

            const sprite = new PIXI.Sprite(textureLoader.get(object.type, directionToName(object.direction)));
            character.addChild(sprite);

            this.objectContainer.addChild(character);
        }
    }

    round(position: Position): Position {
        const { tileWidth, tileHeight } = this.map;

        return {
            x: Math.round(position.x * tileWidth) / tileWidth as X,
            y: Math.round(position.y * tileHeight) / tileHeight as Y,
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
                this.chunkContainer.removeChild(chunk);
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
                this.chunkContainer.addChild(chunk);
            }
        }
    }
}

function chunkPosition(x: X, y: Y): ChunkPosition {
    return (x / CHUNK_WIDTH) + ':' + (y / CHUNK_HEIGHT) as ChunkPosition;
}

function directionToName(direction: Direction): string {
    switch (direction) {
        case 'U':
            return 'up';
        case 'D':
            return 'down';
        case 'L':
            return 'left';
        case 'R':
            return 'right';
    }
}