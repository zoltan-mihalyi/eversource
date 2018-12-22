import { Zone } from '../world/Zone';
import { Entity } from './Entity';
import { EntityOwner } from './EntityOwner';

export interface EntityFactory {
    create(owner: EntityOwner): Entity;
}

export class Spawner extends EntityOwner {
    private nextSpawnTime: number | null = null;
    private entity!: Entity;

    constructor(private zone: Zone, private spawnTime: number, private factory: EntityFactory) {
        super();
        this.spawn();
    }

    updateTime(time: number) {
        if (this.nextSpawnTime === null || time < this.nextSpawnTime) {
            return;
        }

        this.spawn();
    }

    removeEntity() {
        this.zone.removeEntity(this.entity);
        this.nextSpawnTime = Date.now() + this.spawnTime;
    }

    private spawn() {
        this.entity = this.factory.create(this);
        this.zone.addEntity(this.entity);
        this.nextSpawnTime = null;
    }
}