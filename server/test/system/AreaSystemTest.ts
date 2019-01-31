import { EntityContainer } from '../../../common/es/EntityContainer';
import { EventBus } from '../../../common/es/EventBus';
import { ServerComponents } from '../../src/es/ServerComponents';
import { ServerEvents } from '../../src/es/ServerEvents';
import * as sinon from 'sinon';
import { areaSystem } from '../../src/es/AreaSystem';
import { spatialIndexingSystem } from '../../src/es/SpatialIndexingSystem';
import { position } from '../sampleData';


describe('AreaSystem', function () {
    it('should emit area event for intersecting entities', async function () {
        const container = new EntityContainer<ServerComponents>();
        const eventBus = new EventBus<ServerEvents>();

        const index = spatialIndexingSystem(container, eventBus);
        const e1 = container.createEntity({
            position: position(100, 100),
        });
        const e2 = container.createEntity({
            position: position(200, 100),
        });
        container.createEntity({
            position: position(300, 100),
        });
        container.createEntity({
            position: position(150, 150),
            area: {
                name: 'Test',
                width: 101,
                height: 101,
            },
        });

        const onArea = sinon.spy();
        eventBus.on('area', onArea);

        areaSystem(index, container, eventBus);

        eventBus.emit('update', {} as any);

        sinon.assert.calledTwice(onArea); //TODO snapshot
    });
});
