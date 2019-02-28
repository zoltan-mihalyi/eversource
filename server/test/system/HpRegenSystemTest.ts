import { EntityContainer } from '../../../common/es/EntityContainer';
import { EventBus } from '../../../common/es/EventBus';
import { ServerComponents } from '../../src/es/ServerComponents';
import { ServerEvents } from '../../src/es/ServerEvents';
import * as assert from 'assert';
import { hpRegenSystem } from '../../src/es/HpRegenSystem';
import { ServerEntityContainer } from '../../src/es/ServerEntityContainer';


describe('HpRegenSystem', function () {
    it('missing hp', async function () {
        const container = new ServerEntityContainer();
        const eventBus = new EventBus<ServerEvents>();

        hpRegenSystem(container, eventBus);

        const entity = container.createEntity({
            hp: { current: 80, max: 100 },
        });

        eventBus.emit('update', { delta: 500, deltaInSec: 0.5, now: 0 });

        assert.strictEqual(entity.components.hp!.current, 82);
    });

    it('full hp', async function () {
        const container = new ServerEntityContainer();
        const eventBus = new EventBus<ServerEvents>();

        hpRegenSystem(container, eventBus);

        const entity = container.createEntity({
            hp: { current: 99, max: 100 },
        });

        eventBus.emit('update', { delta: 1500, deltaInSec: 1.5, now: 0 });

        assert.strictEqual(entity.components.hp!.current, 100);
    });
});
