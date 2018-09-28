import { X, Y, ZoneId } from '../../../common/domain/Location';
import { MapLoader } from './MapLoader';
import { Zone } from './Zone';
import { CharacterEntity } from '../entity/CharacterEntity';
import { Direction, Position } from '../../../common/GameObject';
import { Presets } from './Presets';

export interface World {
    getZone(zoneId: ZoneId): Promise<Zone>;
}

const FPS = 50;
const INTERVAL = 1000 / FPS;

export class WorldImpl implements World {
    private readonly zonePromises = new Map<ZoneId, Promise<Zone>>();
    private readonly zones = new Map<ZoneId, Zone>();
    private readonly timer: NodeJS.Timer;

    constructor(private mapLoader: MapLoader, private presets: Presets) {
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
            if (object.type === 'npc') {
                const npc = this.presets[object.name!];
                const position: Position = {
                    x: object.x / mapData.tileWidth as X,
                    y: object.y / mapData.tileHeight as Y,
                };
                const characterEntity = new CharacterEntity(position, npc.appearance, npc.equipment);
                const direction = (object.properties as any).direction;
                if (typeof direction === 'string') {
                    characterEntity.setSingle('direction', nameToDirection(direction));
                }
                zone.addEntity(characterEntity);
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

function nameToDirection(name: string): Direction {
    switch (name) {
        case 'up':
            return 'U';
        case 'left':
            return 'L';
        case 'right':
            return 'R';
        default:
            return 'D';
    }
}