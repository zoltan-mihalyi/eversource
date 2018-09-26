import { Chunk } from './Chunk';
import { X, Y } from '../../../common/domain/Location';
import { TexturedTileSet } from './TexturedTileset';
import * as PIXI from 'pixi.js';
import { Opaque } from '../../../common/util/Opaque';
import { GameObject, ObjectId, Position } from '../../../common/GameObject';
import { TextureLoader } from './TextureLoader';
import { Character } from '../game/Character';
import { CancellableProcess } from '../../../common/util/CancellableProcess';
import { Diff } from '../../../common/protocol/Diff';
import { LoadedMap } from '../../../common/tiled/TiledResolver';
import ResourceDictionary = PIXI.loaders.ResourceDictionary;
import DisplayObject = PIXI.DisplayObject;

const CHUNK_WIDTH = 16;
const CHUNK_HEIGHT = 16;

type ChunkPosition = Opaque<string, 'ChunkPosition'>;

export class GameLevel {
    readonly chunks = new Map<ChunkPosition, Chunk>();

    readonly visibleChunks = new Set<Chunk>();
    readonly container = new PIXI.Container();
    readonly chunkBaseContainer = new PIXI.Container();
    private characters = new Map<ObjectId, Character>();
    readonly objectContainer = new PIXI.Container();
    readonly chunkAboveContainer = new PIXI.Container();
    private readonly tileSet: TexturedTileSet[];
    private readonly process = new CancellableProcess();
    private readonly textureLoader = new TextureLoader(this.process);

    constructor(readonly map: LoadedMap, images: ResourceDictionary) {
        this.tileSet = map.tileSets.map(tileset => new TexturedTileSet(tileset, images));
        this.container.addChild(this.chunkBaseContainer);
        this.container.addChild(this.objectContainer);
        this.container.addChild(this.chunkAboveContainer);

        for (let chunkX = 0; chunkX < map.map.width; chunkX += CHUNK_WIDTH) {
            for (let chunkY = 0; chunkY <= map.map.height; chunkY += CHUNK_HEIGHT) {
                const chunk = new Chunk(this.map, this.tileSet, chunkX as X, chunkY as Y, CHUNK_WIDTH, CHUNK_HEIGHT);
                this.chunks.set(chunkPosition(chunkX as X, chunkY as Y), chunk);
            }
        }
    }

    updateObjects(diffs: Diff[]) {
        const { tilewidth, tileheight } = this.map.map;

        const updateCharacterPosition = (character: Character, changes: Partial<GameObject>) => {
            if (!changes.position) {
                return;
            }

            const { x, y } = this.round(changes.position);

            character.x = x - 16 / tilewidth; // TODO read from file?
            character.y = y - 40 / tileheight;
            character.scale.x = 1 / tilewidth;
            character.scale.y = 1 / tileheight;
        };

        for (const diff of diffs) {
            switch (diff.type) {
                case 'create': {
                    const character = new Character(this.textureLoader, diff.object);
                    this.characters.set(diff.id, character);
                    this.objectContainer.addChild(character);
                    updateCharacterPosition(character, diff.object);
                    break;
                }
                case 'change': {
                    const character = this.characters.get(diff.id)!;
                    character.update(diff.changes);
                    updateCharacterPosition(character, diff.changes);
                    break;
                }
                case 'remove': {
                    const character = this.characters.get(diff.id)!;
                    this.characters.delete(diff.id);
                    this.objectContainer.removeChild(character);
                    break;
                }
            }
        }

        this.objectContainer.children.sort(zIndexSorter);
    }

    round(position: Position): Position {
        const { tilewidth, tileheight } = this.map.map;

        return {
            x: Math.round(position.x * tilewidth) / tilewidth as X,
            y: Math.round(position.y * tileheight) / tileheight as Y,
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

    destroy() {
        this.process.stop();
    }
}

function chunkPosition(x: X, y: Y): ChunkPosition {
    return (x / CHUNK_WIDTH) + ':' + (y / CHUNK_HEIGHT) as ChunkPosition;
}

function zIndexSorter(a: DisplayObject, b: DisplayObject): number {
    return a.position.y - b.position.y;
}