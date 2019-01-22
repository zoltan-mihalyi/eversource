import { Zone } from '../world/Zone';
import { Entity } from './Entity';
import { EntityOwner } from './EntityOwner';

export interface EntityFactory {
    create(owner: EntityOwner): Entity;
}

export class Spawner extends EntityOwner {
    private nextSpawnTime: number | null = null;

    constructor(zone: Zone, private spawnTime: number, private factory: EntityFactory) {
        super(zone);
        this.spawn();
    }

    updateTime(time: number) {
        if (this.nextSpawnTime === null || time < this.nextSpawnTime) {
            return;
        }

        this.spawn();
    }

    removeEntity() {
        super.removeEntity();
        this.nextSpawnTime = Date.now() + this.spawnTime;
    }

    private spawn() {
        this.entity = this.factory.create(this);
        this.zone.addEntity(this.entity);
        this.nextSpawnTime = null;
    }
}
