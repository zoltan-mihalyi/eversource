import { EntityContainer } from '../../../common/es/EntityContainer';
import { EventBus } from '../../../common/es/EventBus';
import { ServerComponents } from '../../src/es/ServerComponents';
import { ServerEvents } from '../../src/es/ServerEvents';
import * as assert from 'assert';
import { xpSystem } from '../../src/es/XpSystem';
import { maxXpFor, mobXpReward } from '../../../common/algorithms';

describe('XpSystem', function () {
    it('should add xp on kill', async function () {
        const container = new EntityContainer<ServerComponents>();
        const eventBus = new EventBus<ServerEvents>();

        xpSystem(eventBus);

        const killer = container.createEntity({
            xp: { value: 20 },
            level: { value: 2 },
        });
        eventBus.emit('kill', {
            killer,
            killed: container.createEntity({ level: { value: 10 } }),
        });

        assert.strictEqual(killer.components.level!.value, 2);
        assert.strictEqual(killer.components.xp!.value, 20 + mobXpReward(10));
    });

    it('should add level when xp is full', async function () {
        const container = new EntityContainer<ServerComponents>();
        const eventBus = new EventBus<ServerEvents>();

        xpSystem(eventBus);

        const killer = container.createEntity({
            xp: { value: maxXpFor(2) - 3 },
            level: { value: 2 }
        });
        eventBus.emit('kill', {
            killer,
            killed: container.createEntity({ level: { value: 10 } }),
        });

        assert.strictEqual(killer.components.level!.value, 3);
        assert.strictEqual(killer.components.xp!.value, mobXpReward(10) - 3);
    });

});
