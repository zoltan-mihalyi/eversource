import { Position, X, Y, ZoneId } from '../../../common/domain/Location';
import { MapLoader } from './MapLoader';
import { Zone } from './Zone';
import { BasePreset, HumanoidPresets, MonsterPresets, resolvePresetAttitude } from './Presets';
import { BASE_HUMANOID, BASE_MONSTER, CreatureEntity, HiddenCreatureEntityData } from '../entity/CreatureEntity';
import { BaseCreatureEntityData, CreatureEntityData, Direction } from '../../../common/domain/CreatureEntityData';
import { MovementConfig, WalkingController } from '../entity/controller/WalkingController';
import { TiledObject } from '../../../common/tiled/interfaces';
import { questEnds, questStarts } from '../quest/QuestIndexer';
import { HiddenEntityData } from '../entity/Entity';
import { EntityFactory } from '../entity/Spawner';
import { EntityOwner } from '../entity/EntityOwner';

export interface World {
    getZone(zoneId: ZoneId): Promise<Zone>;
}

const FPS = 50;
const INTERVAL = 1000 / FPS;


function getHidden(object: TiledObject): HiddenCreatureEntityData {
    return {
        name: object.name,
        quests: questStarts[object.name] || [],
        questCompletions: questEnds[object.name] || [],
    };
}

export class WorldImpl implements World {
    private readonly zonePromises = new Map<ZoneId, Promise<Zone>>();
    private readonly zones = new Map<ZoneId, Zone>();
    private readonly timer: NodeJS.Timer;

    constructor(private mapLoader: MapLoader, private humanoidPresets: HumanoidPresets, private monsterPresets: MonsterPresets) {
        this.timer = setInterval(this.update, INTERVAL);
    }

    stop() {
        clearInterval(this.timer);
    }

    getZone(zoneId: ZoneId): Promise<Zone> {
        let zonePromise = this.zonePromises.get(zoneId);
        if (!zonePromise) {
            zonePromise = this.loadZone(zoneId);
            this.zonePromises.set(zoneId, zonePromise);
        }
        return zonePromise;
    }

    private async loadZone(zoneId: ZoneId): Promise<Zone> {
        console.log(`Loading ${zoneId}...`);
        const start = new Date();

        const mapData = await this.mapLoader.load(zoneId);

        console.log(`Loaded ${zoneId} in ${new Date().getTime() - start.getTime()} ms`);
        const zone = new Zone(mapData.grid);

        for (const object of mapData.objects) {
            const position = {
                x: (object.x + object.width / 2) / mapData.tileWidth as X,
                y: (object.y + object.height / 2) / mapData.tileHeight as Y,
            };
            const properties = object.properties || {};
            if (object.type === 'npc') {
                const preset = this.humanoidPresets[object.name];
                const { appearance, equipment } = preset;

                const direction = (properties.direction || 'down') as Direction;

                zone.addSpawner(10000, new CreatureEntityFactory({
                    ...BASE_HUMANOID,
                    ...baseFromPreset(preset, position, false),
                    appearance,
                    equipment,
                    direction,
                }, getHidden(object), properties.controller === 'walking' ? {} : void 0));
            } else if (object.type === 'monster') {
                const preset = this.monsterPresets[object.name];
                const { image, palette, movement } = preset;

                zone.addSpawner(10000, new CreatureEntityFactory({
                    ...BASE_MONSTER,
                    ...baseFromPreset(preset, position, true),
                    image,
                    palette,
                }, getHidden(object), { movement }));
            } else if (object.type === 'area') {
                zone.addArea(
                    object.x / mapData.tileWidth as X,
                    object.y / mapData.tileHeight as Y,
                    object.width / mapData.tileWidth,
                    object.height / mapData.tileHeight,
                    object.name,
                );
            }
        }

        this.zones.set(zoneId, zone);
        return zone;
    }

    private update = () => {
        this.zones.forEach((zone) => {
            zone.update(INTERVAL);
        });
    };
}

type PresetBaseEntityData = Pick<BaseCreatureEntityData, 'attitude' | 'effects' | 'scale' | 'position' | 'name' | 'level'>;

function baseFromPreset(preset: BasePreset, position: Position, monster: boolean): PresetBaseEntityData {
    return {
        position,
        name: preset.name,
        level: preset.level,
        scale: preset.scale || 1,
        attitude: resolvePresetAttitude(preset.attitude, monster),
        effects: preset.effects || [],
    };

}

type ControllerOptions = {
    movement?: MovementConfig;
}

class CreatureEntityFactory implements EntityFactory {
    constructor(private data: CreatureEntityData, private hidden: HiddenCreatureEntityData,
                private options?: ControllerOptions) {

    }

    create(owner: EntityOwner) {
        const { options, data, hidden } = this;

        const controller = options ? new WalkingController(data.position, options.movement) : void 0;
        return new CreatureEntity(owner, data, hidden, controller);
    }
}