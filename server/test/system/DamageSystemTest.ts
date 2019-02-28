import { EntityContainer } from '../../../common/es/EntityContainer';
import { EventBus } from '../../../common/es/EventBus';
import { ServerComponents } from '../../src/es/ServerComponents';
import { ServerEvents } from '../../src/es/ServerEvents';
import * as sinon from 'sinon';
import * as assert from 'assert';
import { damageSystem } from '../../src/es/DamageSystem';
import { ServerEntityContainer } from '../../src/es/ServerEntityContainer';


describe('DamageSystem', function () {
    it('should reduce hp', async function () {
        const container = new ServerEntityContainer();
        const eventBus = new EventBus<ServerEvents>();

        damageSystem(eventBus);

        const target = container.createEntity({
            hp: { current: 100, max: 100 },
        });
        eventBus.emit('damage', {
            type: 'physical',
            amount: 19,
            source: container.createEntity({
                weapon: { damage: 15 },
                level: { value: 10 },
            }),
            target,
        });

        assert.strictEqual(target.components.hp!.current, 81);
    });

    it('should kill', async function () {
        const container = new ServerEntityContainer();
        const eventBus = new EventBus<ServerEvents>();
        const onKill = sinon.spy();
        eventBus.on('kill', onKill);

        damageSystem(eventBus);

        const target = container.createEntity({
            hp: { current: 18, max: 100 },
        });
        eventBus.emit('damage', {
            type: 'physical',
            amount: 19,
            source: container.createEntity({
                weapon: { damage: 15 },
                level: { value: 10 },
            }),
            target,
        });

        assert.strictEqual(target.components.hp!.current, 0);
        sinon.assert.calledOnce(onKill); // TODO snapshot
    });
});
