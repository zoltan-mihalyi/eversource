import { EventBus } from '../../../common/es/EventBus';
import { ServerEvents } from './ServerEvents';

export function damageSystem(eventBus: EventBus<ServerEvents>) {
    eventBus.on('damage', (damage) => {
        const { source, target } = damage;

        const { hp } = target.components;

        if (!hp) {
            return;
        }

        const newHp = Math.max(0, hp.current - damage.amount);

        target.set('hp', {
            current: newHp,
            max: hp.max,
        });

        if (newHp === 0) {
            eventBus.emit('kill', {
                killer: source,
                killed: target,
            });
        }
    });
}
