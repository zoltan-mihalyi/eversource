import { EventBus } from '../../../common/es/EventBus';
import { ServerEvents } from './ServerEvents';
import { EntityContainer } from '../../../common/es/EntityContainer';
import { ServerComponents } from './ServerComponents';
import * as rbush from 'rbush';
import { PositionBox } from './SpatialIndexingSystem';

export function areaSystem(index: rbush.RBush<PositionBox>, container: EntityContainer<ServerComponents>, eventBus: EventBus<ServerEvents>) {
    const areas = container.createQuery('position', 'area');

    eventBus.on('update', () => {
        areas.forEach((areaComponents, areaEntity) => {
            const { width, height } = areaComponents.area;
            const { x, y } = areaComponents.position;

            for (const { entity } of index.search(centerPositionedBBox(x, y, width, height))) {
                if (entity === areaEntity) {
                    continue;
                }
                eventBus.emit('area', {
                    visitor: entity,
                    name: areaComponents.area.name,
                });
            }
        });

    });
}

function centerPositionedBBox(x: number, y: number, width: number, height: number): rbush.BBox {
    const halfWidth = width / 2;
    const halfHeight = height / 2;

    return {
        minX: x - halfWidth,
        minY: y - halfHeight,
        maxX: x + halfWidth,
        maxY: y + halfHeight,
    };
}
