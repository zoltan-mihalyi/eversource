import * as rbush from "rbush";
import { Entity } from '../../../common/es/Entity';
import { ServerComponents } from './ServerComponents';
import { EntityContainer } from '../../../common/es/EntityContainer';
import { EventBus } from '../../../common/es/EventBus';
import { ServerEvents } from './ServerEvents';

export interface PositionBox extends rbush.BBox {
    entity: Entity<ServerComponents>;
}

export function spatialIndexingSystem(container: EntityContainer<ServerComponents>, eventBus:EventBus<ServerEvents>): rbush.RBush<PositionBox> {
    const positions = container.createQuery('position');

    const index = rbush<PositionBox>();

    function buildIndex() {
        index.clear();
        positions.forEach((components, entity) => {
            const { x, y } = components.position;
            index.insert({
                minX: x,
                minY: y,
                maxX: x,
                maxY: y,
                entity,
            });
        });
    }

    eventBus.on('init', buildIndex);
    eventBus.on('update', buildIndex);

    return index;
}
