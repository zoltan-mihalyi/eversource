import { Position, X, Y, ZoneId } from '../../../common/domain/Location';
import { MapLoader } from './MapLoader';
import { Zone } from './Zone';
import {
    BasePreset,
    CreaturePreset,
    HumanoidPresets,
    MonsterPresets,
    MovementConfig,
    ObjectPresets,
    resolvePresetAttitude,
} from './Presets';
import { TiledProperties } from '../../../common/tiled/interfaces';
import { questEnds, questStarts } from '../quest/QuestIndexer';
import { hpForLevel } from '../../../common/algorithms';
import { AIMovingController, ServerComponents } from '../es/ServerComponents';
import { Direction } from '../../../common/components/CommonComponents';

export interface World {
    getZone(zoneId: ZoneId): Promise<Zone>;
}

const FPS = 50;
const INTERVAL = 1000 / FPS;

export interface AllPresets {
    humanoid: HumanoidPresets;
    monster: MonsterPresets;
    object: ObjectPresets;
}

export class WorldImpl implements World {
    private readonly zonePromises = new Map<ZoneId, Promise<Zone>>();
    private readonly zones = new Map<ZoneId, Zone>();
    private readonly timer: NodeJS.Timer;

    constructor(private mapLoader: MapLoader, private presets: AllPresets) {
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

        const { presets } = this;

        for (const object of mapData.objects) {
            const position = {
                x: (object.x + object.width / 2) / mapData.tileWidth as X,
                y: (object.y + object.height / 2) / mapData.tileHeight as Y,
            };
            const properties = object.properties || {};
            if (object.type === 'npc') {
                const preset = presets.humanoid[object.name];
                const { appearance, equipment } = preset;

                const controllers: Partial<ServerComponents> = properties.controller !== 'walking' ? {} : {
                    aiMovingController: getController(position),
                };

                zone.addSpawner(10000, {
                    ...creatureBaseFromPreset(preset, object.name, properties, false),
                    position,
                    view: {
                        type: 'humanoid',
                        appearance,
                        equipment,
                    },
                    ...controllers,
                });
            } else if (object.type === 'monster') {
                const preset = presets.monster[object.name];
                const { image, palette } = preset;

                zone.addSpawner(10000, {
                    ...creatureBaseFromPreset(preset, object.name, properties, true),
                    position,
                    view: {
                        type: 'simple',
                        image,
                        palette,
                    },
                    aiMovingController: getController(position, preset.movement),
                });
            } else if (object.type === 'object') {
                const preset = presets.object[object.name];
                const { image, animation, useSpell } = preset;

                const template: Partial<ServerComponents> = {
                    ...baseFromPreset(preset, object.name),
                    position,
                    view: {
                        type: 'object',
                        image,
                        animation,
                    },
                };
                if (useSpell) {
                    template.useSpell = useSpell;
                }

                zone.addSpawner(10000, template);
            } else if (object.type === 'area') {
                zone.addArea(
                    position,
                    object.width / mapData.tileWidth,
                    object.height / mapData.tileHeight,
                    object.name,
                );
            }
        }

        this.zones.set(zoneId, zone);
        zone.init();
        return zone;
    }

    private update = () => {
        this.zones.forEach((zone) => {
            zone.update(INTERVAL);
        });
    };
}

function baseFromPreset(preset: BasePreset, npcId: string): Partial<ServerComponents> {
    const result: Partial<ServerComponents> = {
        npcId,
        name: {
            value: preset.name,
        },
        scale: { value: preset.scale || 1 },

    };

    if (preset.effects) {
        result.effects = preset.effects;
    }

    if (questStarts[npcId] || questEnds[npcId] || preset.story) {
        let story = preset.story;
        if (!story) {
            console.warn(`${npcId} has no story!`);
            story = '';
        }
        result.interactable = {
            story,
            quests: questStarts[npcId] || [],
            questCompletions: questEnds[npcId] || [],
        };
    }

    return result;
}

function creatureBaseFromPreset(preset: CreaturePreset, npcId: string, properties: TiledProperties, monster: boolean): Partial<ServerComponents> {
    const hp = hpForLevel(preset.level);

    return {
        ...baseFromPreset(preset, npcId),
        activity: 'standing',
        direction: objectDirection(properties),
        hp: {
            current: hp,
            max: hp,
        },
        level: { value: preset.level },
        attitude: {
            value: resolvePresetAttitude(preset.attitude, monster),
        },
        speed: {
            running: 4,
            walking: 2,
        },
    };
}

function getController(position: Position, config: MovementConfig = {}): AIMovingController {
    const running = config.running || false;
    const interval = (config.interval || 10) as number;

    const radiusX = config.radiusX !== void 0 ? config.radiusX : 6;
    const radiusY = config.radiusY !== void 0 ? config.radiusY : 5;

    return {
        nextMoveTime: 0,
        initial: position,
        target: position,

        running,
        interval,
        radiusX,
        radiusY,
    };
}

function objectDirection(properties: TiledProperties): Direction {
    return (properties.direction as Direction | undefined) || 'down';
}
