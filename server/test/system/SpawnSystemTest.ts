import { spawnSystem } from '../../src/es/SpawnSystem';
import { EntityContainer } from '../../../common/es/EntityContainer';
import { EventBus } from '../../../common/es/EventBus';
import { ServerComponents } from '../../src/es/ServerComponents';
import { ServerEvents } from '../../src/es/ServerEvents';
import * as sinon from 'sinon';
import { ServerEntityContainer } from '../../src/es/ServerEntityContainer';


describe('SpawnSystem', function () {
    it('should destroy entity', async function () {
        const container = new ServerEntityContainer();
        const eventBus = new EventBus<ServerEvents>();
        const entity = container.createEntity({});
        const removeEntitySpy = sinon.spy();
        container.removeEntity = removeEntitySpy;

        spawnSystem(container, eventBus);

        eventBus.emit('kill', {
            killer: container.createEntity(),
            killed: entity,
        });

        sinon.assert.calledOnce(removeEntitySpy);
        sinon.assert.calledWith(removeEntitySpy, entity);
    });


    it('should respawn', async function () {
        const container = new ServerEntityContainer();
        const eventBus = new EventBus<ServerEvents>();
        const createEntitySpy = sinon.spy();
        const start = Date.now();

        spawnSystem(container, eventBus);

        eventBus.emit('kill', {
            killer: container.createEntity(),
            killed: container.createEntity({
                spawnedBy: {
                    spawner: container.createEntity({
                        spawner: {
                            spawnTime: 100,
                            template: { name: { value: 'Test' } },
                        },
                    }),
                },
            }),
        });
        container.createEntity = createEntitySpy;

        eventBus.emit('update', { now: start, delta: 0, deltaInSec: 0 });
        sinon.assert.notCalled(createEntitySpy);

        const now = Date.now();
        eventBus.emit('update', { now: now + 200, delta: 0, deltaInSec: 0 });
        sinon.assert.calledOnce(createEntitySpy);

        eventBus.emit('update', { now: now + 400, delta: 0, deltaInSec: 0 });
        sinon.assert.calledOnce(createEntitySpy);

    });

});
