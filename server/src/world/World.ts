import { Location, ZoneId } from '../../../common/domain/Location';
import { CancellationToken } from '../util/CancellationToken';
import { Grid } from './Grid';
import { GridLoader } from './GridLoader';

export interface WorldObject {
    world: World;
}

type Cb = () => void;

export interface World {
    createObject(location: Location, token: CancellationToken, callback: (object: WorldObject) => void): void;

    removeObject(object: WorldObject): void;
}

export class WorldImpl implements World {
    private loadingLocations = new Map<ZoneId, Cb[]>();
    private locations = new Map<ZoneId, Grid>();
    private objects = new Set<WorldObject>();

    constructor(private gridLoader: GridLoader) {
    }

    createObject(location: Location, token: CancellationToken, callback: (object: WorldObject) => void): void {
        this.loadLocation(location, () => {
            if (token.cancelled) {
                return;
            }
            const object = {
                world: this,
            };
            this.objects.add(object);
            callback(object);
        });
    }

    removeObject(object: WorldObject) {
        this.objects.delete(object);
    }

    private loadLocation(location: Location, callback: () => void) {
        const { zoneId } = location;
        if (this.locations.has(zoneId)) {
            callback();
            return;
        }

        this.addZoneLoadingCallback(zoneId, callback);
    }

    private addZoneLoadingCallback(zoneId: ZoneId, callback: Cb) {
        const callbacks = this.loadingLocations.get(zoneId);

        if (callbacks) {
            callbacks.push(callback);
            return;
        }

        this.startLoading(zoneId, callback);
    }

    private startLoading(zoneId: ZoneId, callback: Cb) {
        console.log(`Loading ${zoneId}...`);
        const start = new Date();
        const callbacks: Cb[] = [callback];
        this.loadingLocations.set(zoneId, callbacks);
        this.gridLoader.load(zoneId, (err: any, grid?: Grid) => {
            if (err) {
                console.error(`Failed to load zone: ${zoneId}`, err);
                return;
            }

            console.log(`Loaded ${zoneId} in ${new Date().getTime() - start.getTime()} ms`);
            this.locations.set(zoneId, grid!);
            for (const cb of callbacks) {
                cb();
            }
        });
    }
}