import { Chunk } from './Chunk';
import { Position, X, Y } from '../../../common/domain/Location';
import { TexturedTileSet } from './TexturedTileset';
import * as PIXI from 'pixi.js';
import { Opaque } from '../../../common/util/Opaque';
import { Diff } from '../../../common/protocol/Diff';
import { LoadedMap } from '../../../common/tiled/TiledResolver';
import { EntityData, EntityId } from '../../../common/domain/EntityData';
import { UpdatableDisplay } from '../display/UpdatableDisplay';
import { HumanoidDisplay } from '../display/HumanoidDisplay';
import { MonsterDisplay } from '../display/MonsterDisplay';
import { GameContext } from '../game/GameContext';
import { PlayerState } from '../../../common/protocol/PlayerState';
import { InteractionTable } from '../../../common/domain/InteractionTable';
import ResourceDictionary = PIXI.loaders.ResourceDictionary;
import DisplayObject = PIXI.DisplayObject;
import { CreatureDisplay } from '../display/CreatureDisplay';

const CHUNK_WIDTH = 16;
const CHUNK_HEIGHT = 16;

type ChunkPosition = Opaque<string, 'ChunkPosition'>;

export class GameLevel {
    readonly chunks = new Map<ChunkPosition, Chunk>();

    readonly visibleChunks = new Set<Chunk>();
    readonly container = new PIXI.Container();
    readonly chunkBaseContainer = new PIXI.Container();
    private entityDisplays = new Map<EntityId, UpdatableDisplay<any>>();
    private displayIds = new Map<DisplayObject, EntityId>();
    readonly objectContainer = new PIXI.Container();
    readonly chunkAboveContainer = new PIXI.Container();
    private readonly tileSet: TexturedTileSet[];
    private entityId!: EntityId;
    private interaction: InteractionTable | null = null;
    private scale: number = 1;

    constructor(private context: GameContext, readonly map: LoadedMap, images: ResourceDictionary) {
        this.tileSet = map.tileSets.map(tileset => new TexturedTileSet(tileset, images));
        this.chunkBaseContainer.interactiveChildren = false;
        this.chunkAboveContainer.interactiveChildren = false;
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

    setScale(scale: number) {
        this.scale = scale;
    }

    updateObjects(diffs: Diff<EntityId, EntityData>[]) {
        const { tilewidth, tileheight } = this.map.map;

        const updateDisplayPosition = <T extends EntityData>(display: UpdatableDisplay<T>, changes: Partial<T>) => {
            const position = changes.position;
            if (!position) {
                return;
            }

            const { x, y } = this.round(position);

            display.x = x * tilewidth;
            display.y = y * tileheight;
        };

        for (const diff of diffs) {
            const id = diff.id;
            switch (diff.type) {
                case 'create': {
                    const display = this.createDisplay(id, diff.data);
                    display.init();
                    this.entityDisplays.set(id, display);
                    this.displayIds.set(display, id);
                    this.objectContainer.addChild(display);
                    updateDisplayPosition(display, diff.data);
                    break;
                }
                case 'change': {
                    const display = this.entityDisplays.get(id)!;
                    display.update(diff.changes);
                    updateDisplayPosition(display, diff.changes);
                    break;
                }
                case 'remove': {
                    const display = this.entityDisplays.get(id)!;
                    this.entityDisplays.delete(id);
                    this.displayIds.delete(display);
                    this.objectContainer.removeChild(display);
                    display.destroy({ children: true });
                    break;
                }
            }
        }

        this.objectContainer.children.sort((a: DisplayObject, b: DisplayObject) => {
            const difference = a.position.y - b.position.y;
            if (difference === 0) {
                return this.displayIds.get(a)! - this.displayIds.get(b)!;
            }
            return difference;
        });
    }

    updatePlayerState(state: PlayerState) {
        if (state.character) {
            this.entityId = state.character.id;
            if (this.interaction && this.interaction !== state.interaction) {
                (this.entityDisplays.get(this.interaction.entityId) as CreatureDisplay<any>).clearFacing();
            }
        }
        this.interaction = state.interaction;
    }

    round(position: Position): Position {
        const { tilewidth, tileheight } = this.map.map;

        const roundX = tilewidth * this.scale;
        const roundY = tileheight * this.scale;

        return {
            x: Math.round(position.x * roundX) / roundX as X,
            y: Math.round(position.y * roundY) / roundY as Y,
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

    update() {
        if (this.interaction) {
            const display = this.entityDisplays.get(this.interaction.entityId) as CreatureDisplay<any>;
            const player = this.entityDisplays.get(this.entityId)!;
            display.setFacing(player.x, player.y);
        }
    }

    private createDisplay(id: EntityId, data: EntityData): UpdatableDisplay<EntityData> {
        const self = id === this.entityId;
        switch (data.type) {
            case 'humanoid':
                return new HumanoidDisplay(id, this.context, data, self);
            case 'monster':
                return new MonsterDisplay(id, this.context, data, self);
        }
        throw new Error('Unknown entity!');
    }
}

function chunkPosition(x: X, y: Y): ChunkPosition {
    return (x / CHUNK_WIDTH) + ':' + (y / CHUNK_HEIGHT) as ChunkPosition;
}
