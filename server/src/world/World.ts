import { ZoneId } from '../../../common/domain/Location';
import { GridLoader } from './GridLoader';
import { Grid } from '../../../common/Grid';
import { Zone } from './Zone';

type ZoneCb = (zone: Zone) => void;

export interface World {
    getZone(zoneId: ZoneId, callback: ZoneCb): void;
}

export class WorldImpl implements World {
    private loadingZones = new Map<ZoneId, ZoneCb[]>();
    private zones = new Map<ZoneId, Zone>();

    constructor(private gridLoader: GridLoader) {
    }

    getZone(zoneId: ZoneId, callback: ZoneCb) {
        if (this.zones.has(zoneId)) {
            callback(this.zones.get(zoneId)!);
            return;
        }

        this.addZoneLoadingCallback(zoneId, callback);
    }

    private addZoneLoadingCallback(zoneId: ZoneId, callback: ZoneCb) {
        const callbacks = this.loadingZones.get(zoneId);

        if (callbacks) {
            callbacks.push(callback);
            return;
        }

        this.startLoading(zoneId, callback);
    }

    private startLoading(zoneId: ZoneId, callback: ZoneCb) {
        console.log(`Loading ${zoneId}...`);
        const start = new Date();
        const callbacks: ZoneCb[] = [callback];
        this.loadingZones.set(zoneId, callbacks);
        this.gridLoader.load(zoneId, (err: any, grid?: Grid) => {
            if (err) {
                console.error(`Failed to load zone: ${zoneId}`, err);
                return;
            }

            console.log(`Loaded ${zoneId} in ${new Date().getTime() - start.getTime()} ms`);
            const zone = new Zone(grid!);

            this.zones.set(zoneId, zone);
            for (const cb of callbacks) {
                cb(zone);
            }
        });
    }
}