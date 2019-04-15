import { EventBus } from '../../../common/es/EventBus';
import { ServerEvents } from '../../src/es/ServerEvents';
import * as sinon from 'sinon';
import { attackSystem } from '../../src/es/AttackSystem';
import { ServerEntityContainer } from '../../src/es/ServerEntityContainer';


describe('AttackSystem', function () {
    it('should emit damage event', async function () {
        const container = new ServerEntityContainer();
        const eventBus = new EventBus<ServerEvents>();
        const onDamage = sinon.spy();
        eventBus.on('damage', onDamage);

        attackSystem(eventBus);

        eventBus.emit('hit', {
            source: container.createEntity({
                weapon: { damage: 15 },
                level: { value: 10 }
            }),
            target: container.createEntity(),
        });

        sinon.assert.calledOnce(onDamage); // TODO snapshot
    });

});
