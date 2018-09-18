import { Grid } from '../../../common/Grid';
import { Entity } from '../entity/Entity';
import * as rbush from 'rbush';
import BBox = rbush.BBox;

interface EntityBox extends rbush.BBox {
    entity: Entity;
}

export class Zone {
    private entities = new Map<Entity, EntityBox>();
    private entityIndex = rbush<EntityBox>();

    constructor(private grid: Grid) {
    }

    addEntity(entity: Entity) {
        const bBox = entityBBox(entity);
        this.entities.set(entity, bBox);
        this.entityIndex.insert(bBox);
    }

    removeEntity(entity: Entity): void {
        const bBox = this.entities.get(entity)!;
        this.entities.delete(entity);
        this.entityIndex.remove(bBox);
    }

    query(minX: number, minY: number, maxX: number, maxY: number): Entity[] {
        return this.entityIndex.search({ minX, minY, maxX, maxY }).map(box => box.entity);
    }

    update(interval: number) {
        this.entities.forEach((bBox: BBox, entity: Entity) => {
            const lastPosition = entity.get().position;
            entity.update(this.grid, interval);
            if (entity.get().position !== lastPosition) {
                this.handlePositionChange(entity);
            }
        });
    }

    private handlePositionChange(entity: Entity) {
        const bBox = entityBBox(entity);
        const prevBox = this.entities.get(entity)!;
        this.entityIndex.remove(prevBox);
        this.entities.set(entity, bBox);
        this.entityIndex.insert(bBox);
    }
}

function entityBBox(entity: Entity): EntityBox {
    const { x, y } = entity.get().position;
    return { minX: x, minY: y, maxX: x, maxY: y, entity };
}