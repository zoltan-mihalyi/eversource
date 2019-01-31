import { EntityContainer } from '../../../common/es/EntityContainer';
import { EventBus } from '../../../common/es/EventBus';
import { ServerComponents } from '../../src/es/ServerComponents';
import { ServerEvents } from '../../src/es/ServerEvents';
import * as sinon from 'sinon';
import { attackSystem } from '../../src/es/AttackSystem';


describe('AttackSystem', function () {
    it('should emit damage event', async function () {
        const container = new EntityContainer<ServerComponents>();
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
