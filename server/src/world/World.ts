import { X, Y, ZoneId } from '../../../common/domain/Location';
import { MapLoader } from './MapLoader';
import { Zone } from './Zone';
import { Presets } from './Presets';
import { BASE_HUMANOID, BASE_MONSTER, CreatureEntity } from '../entity/CreatureEntity';
import { Direction } from '../../../common/domain/CreatureEntityData';
import { WalkingController } from '../entity/controller/WalkingController';

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
            const position = {
                x: object.x / mapData.tileWidth as X,
                y: object.y / mapData.tileHeight as Y,
            };
            const properties = object.properties || {};
            if (object.type === 'npc') {
                const npc = this.presets[object.name!];
                const { appearance, equipment } = npc;

                const directionProp = properties.direction as Direction | undefined;

                const direction = typeof directionProp === 'string' ? directionProp : 'down';
                const controller = properties.controller === 'walking' ? new WalkingController(position) : void 0;
                const characterEntity = new CreatureEntity({
                    ...BASE_HUMANOID,
                    position,
                    direction,
                    appearance,
                    equipment,
                }, controller);
                zone.addEntity(characterEntity);
            } else if (object.type === 'monster') {
                zone.addEntity(new CreatureEntity({
                    ...BASE_MONSTER,
                    position,
                    image: object.name,
                    palette: (properties.palette as string | undefined) || null,
                }, new WalkingController(position)))
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
