import { Chunk } from './Chunk';
import { Position, X, Y } from '../../../common/domain/Location';
import { TexturedTileSet } from './TexturedTileset';
import * as PIXI from 'pixi.js';
import { Opaque } from '../../../common/util/Opaque';
import { TextureLoader } from './TextureLoader';
import { CancellableProcess } from '../../../common/util/CancellableProcess';
import { Diff } from '../../../common/protocol/Diff';
import { LoadedMap } from '../../../common/tiled/TiledResolver';
import { EntityData, EntityId } from '../../../common/domain/EntityData';
import { UpdatableDisplay } from '../display/UpdatableDisplay';
import { HumanoidDisplay } from '../display/HumanoidDisplay';
import ResourceDictionary = PIXI.loaders.ResourceDictionary;
import DisplayObject = PIXI.DisplayObject;
import { MonsterDisplay } from '../display/MonsterDisplay';

const CHUNK_WIDTH = 16;
const CHUNK_HEIGHT = 16;

type ChunkPosition = Opaque<string, 'ChunkPosition'>;

export class GameLevel {
    readonly chunks = new Map<ChunkPosition, Chunk>();

    readonly visibleChunks = new Set<Chunk>();
    readonly container = new PIXI.Container();
    readonly chunkBaseContainer = new PIXI.Container();
    private entityDisplays = new Map<EntityId, UpdatableDisplay<any>>();
    readonly objectContainer = new PIXI.Container();
    readonly chunkAboveContainer = new PIXI.Container();
    private readonly tileSet: TexturedTileSet[];
    private readonly process = new CancellableProcess();
    private readonly textureLoader = new TextureLoader(this.process, this.map.map.tileheight);

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

        const updateDisplayPosition = <T extends EntityData>(display: UpdatableDisplay<T>, changes: Partial<T>) => {
            const position = changes.position;
            if (!position) {
                return;
            }

            const { x, y } = this.round(position);

            display.x = x;
            display.y = y;
            display.scale.x = 1 / tilewidth;
            display.scale.y = 1 / tileheight;
        };

        for (const diff of diffs) {
            switch (diff.type) {
                case 'create': {
                    const display = this.createDisplay(diff.data);
                    this.entityDisplays.set(diff.id, display);
                    this.objectContainer.addChild(display);
                    updateDisplayPosition(display, diff.data);
                    break;
                }
                case 'change': {
                    const character = this.entityDisplays.get(diff.id)!;
                    character.update(diff.changes);
                    updateDisplayPosition(character, diff.changes);
                    break;
                }
                case 'remove': {
                    const character = this.entityDisplays.get(diff.id)!;
                    this.entityDisplays.delete(diff.id);
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

    private createDisplay(data: EntityData): UpdatableDisplay<any> {
        switch (data.type) {
            case 'creature':
                switch (data.kind) {
                    case 'humanoid':
                        return new HumanoidDisplay(this.textureLoader, data);
                    case 'monster':
                        return new MonsterDisplay(this.textureLoader, data);
                }
        }
        throw new Error('Unknown entity!');
    }
}

function chunkPosition(x: X, y: Y): ChunkPosition {
    return (x / CHUNK_WIDTH) + ':' + (y / CHUNK_HEIGHT) as ChunkPosition;
}

function zIndexSorter(a: DisplayObject, b: DisplayObject): number {
    return a.position.y - b.position.y;
}