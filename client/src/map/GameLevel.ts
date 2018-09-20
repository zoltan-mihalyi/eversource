import { Chunk } from './Chunk';
import { X, Y } from '../../../common/domain/Location';
import { Map as TmxMap } from '@eversource/tmx-parser';
import { TexturedTileSet } from './TexturedTileset';
import * as PIXI from 'pixi.js';
import { Opaque } from '../../../common/util/Opaque';
import { GameObject, ObjectId, Position } from '../../../common/GameObject';
import { TextureLoader } from './TextureLoader';
import ResourceDictionary = PIXI.loaders.ResourceDictionary;
import { Character } from '../game/Character';
import DisplayObject = PIXI.DisplayObject;

const CHUNK_WIDTH = 16;
const CHUNK_HEIGHT = 16;

type ChunkPosition = Opaque<string, 'ChunkPosition'>;

export class GameLevel {
    private readonly textureLoader = new TextureLoader();
    readonly chunks = new Map<ChunkPosition, Chunk>();

    readonly visibleChunks = new Set<Chunk>();
    readonly container = new PIXI.Container();
    readonly chunkBaseContainer = new PIXI.Container();
    private characters = new Map<ObjectId, Character>();
    readonly objectContainer = new PIXI.Container();
    readonly chunkAboveContainer = new PIXI.Container();
    private readonly tileSet: TexturedTileSet[];

    constructor(readonly map: TmxMap, images: ResourceDictionary) {
        this.tileSet = map.tileSets.map(tileset => new TexturedTileSet(tileset, images));
        this.container.addChild(this.chunkBaseContainer);
        this.container.addChild(this.objectContainer);
        this.container.addChild(this.chunkAboveContainer);

        for (let chunkX = 0; chunkX < map.width; chunkX += CHUNK_WIDTH) {
            for (let chunkY = 0; chunkY <= map.height; chunkY += CHUNK_HEIGHT) {
                const chunk = new Chunk(this.map, this.tileSet, chunkX as X, chunkY as Y, CHUNK_WIDTH, CHUNK_HEIGHT);
                this.chunks.set(chunkPosition(chunkX as X, chunkY as Y), chunk);
            }
        }
    }

    updateObjects(objects: GameObject[]) {
        const { tileWidth, tileHeight } = this.map;

        const charactersToRemove = new Map<ObjectId, Character>();
        this.characters.forEach((character, id) => charactersToRemove.set(id, character));

        for (const object of objects) {
            const { x, y } = this.round(object.position);

            const id = object.id;
            charactersToRemove.delete(id);

            let character = this.characters.get(id);
            if (!character) {
                character = new Character(this.textureLoader, object);
                this.characters.set(id, character);

                this.objectContainer.addChild(character);
            }else{
                character.update(object);
            }

            character.x = x - 16 / tileWidth; // TODO read from file?
            character.y = y - 40 / tileHeight;
            character.scale.x = 1 / tileWidth;
            character.scale.y = 1 / tileHeight;
        }

        charactersToRemove.forEach((character, id) => {
            this.characters.delete(id);
            this.objectContainer.removeChild(character);
        });

        this.objectContainer.children.sort(zIndexSorter);
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
                this.chunkBaseContainer.removeChild(chunk.base);
                this.chunkAboveContainer.removeChild(chunk.above);
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
                this.chunkBaseContainer.addChild(chunk.base);
                this.chunkAboveContainer.addChild(chunk.above);
            }
        }
    }
}

function chunkPosition(x: X, y: Y): ChunkPosition {
    return (x / CHUNK_WIDTH) + ':' + (y / CHUNK_HEIGHT) as ChunkPosition;
}

function zIndexSorter(a: DisplayObject, b: DisplayObject): number {
    return a.position.y - b.position.y;
}