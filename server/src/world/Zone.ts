import { Grid } from '../../../common/Grid';
import { X, Y } from '../../../common/domain/Location';
import { Entity } from '../entity/Entity';

export class Zone {
    private entities = new Set<Entity>();

    constructor(private grid: Grid) {
    }

    addEntity(entity: Entity) {
        this.entities.add(entity);
    }

    removeEntity(entity: Entity): void {
        this.entities.delete(entity);
    }

    query(except: Entity): Entity[] {
        const result: Entity[] = [];
        this.entities.forEach(entity => {
            if (except === entity) {
                return;
            }
            result.push(entity);
        });
        return result;
    }

    update(interval: number) {
        this.entities.forEach((entity: Entity) => {
            entity.update(this.grid, interval);
        });
    }
}
