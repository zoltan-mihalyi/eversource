import { Grid } from '../../../common/Grid';
import { Entity } from '../entity/Entity';
import * as rbush from 'rbush';
import { EntityId } from '../../../common/domain/EntityData';
import { X, Y } from '../../../common/domain/Location';
import { EntityFactory, Spawner } from '../entity/Spawner';

interface EntityBox extends rbush.BBox {
    entity: Entity;
}

interface AreaBox extends rbush.BBox {
    name: string;
}

export class Zone {
    private spawners = new Set<Spawner>(); // todo active and inactive group?

    private areas = rbush<AreaBox>();
    private entities = new Map<EntityId, EntityBox>();
    private entityIndex = rbush<EntityBox>();

    constructor(private grid: Grid) {
    }

    addSpawner(spawnTime: number, entityCreator: EntityFactory) {
        this.spawners.add(new Spawner(this, spawnTime, entityCreator));
    }

    addEntity(entity: Entity) {
        const bBox = entityBBox(entity);
        this.entities.set(entity.id, bBox);
        this.entityIndex.insert(bBox);
    }

    addArea(x: X, y: Y, width: number, height: number, name: string) {
        this.areas.insert({ minX: x, minY: y, maxX: x + width, maxY: y + height, name });
    }

    getEntity(id: EntityId): Entity | null {
        const entityBox = this.entities.get(id);
        return entityBox ? entityBox.entity : null;
    }

    removeEntity(entity: Entity): void {
        const bBox = this.entities.get(entity.id)!;
        this.entities.delete(entity.id);
        this.entityIndex.remove(bBox);
    }

    query(minX: number, minY: number, maxX: number, maxY: number): Entity[] {
        return this.entityIndex.search({ minX, minY, maxX, maxY }).map(box => box.entity);
    }

    update(interval: number) {
        const time = Date.now();
        this.spawners.forEach(spawner => spawner.updateTime(time));

        this.entities.forEach((entityBox: EntityBox) => {
            const entity = entityBox.entity;
            const lastPosition = entity.get().position;
            entity.update(this.grid, interval);
            if (entity.get().position !== lastPosition) {
                this.handlePositionChange(entity);
            }

            for (const area of this.areas.search(entityBox)) {
                entity.emit({ type: 'area', name: area.name });
            }
        });
    }

    private handlePositionChange(entity: Entity) {
        const bBox = entityBBox(entity);
        const prevBox = this.entities.get(entity.id)!;
        this.entityIndex.remove(prevBox);
        this.entities.set(entity.id, bBox);
        this.entityIndex.insert(bBox);
    }
}

function entityBBox(entity: Entity): EntityBox {
    const { x, y } = entity.get().position;
    return { minX: x, minY: y, maxX: x, maxY: y, entity };
}