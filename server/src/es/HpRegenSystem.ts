import { ServerComponents } from './ServerComponents';
import { EventBus } from '../../../common/es/EventBus';
import { ServerEvents } from './ServerEvents';
import { EntityContainer } from '../../../common/es/EntityContainer';

export function hpRegenSystem(container: EntityContainer<ServerComponents>, eventBus: EventBus<ServerEvents>) {
    const withHp = container.createQuery('hp');

    eventBus.on('update', ({ deltaInSec }) => { // TODO emit to damage/heal system?

        withHp.forEach((components, entity) => {
            const { hp } = components;
            const current = Math.min(hp.max, hp.current + 4 * deltaInSec);
            if (current !== hp.current) {
                entity.set('hp', {
                    max: hp.max,
                    current: current,
                });
            }
        });
    });
}
