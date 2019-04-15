import { EventBus } from '../../../common/es/EventBus';
import { ServerEvents } from './ServerEvents';

export function damageSystem(eventBus: EventBus<ServerEvents>) {
    eventBus.on('damage', (damage) => {
        const { source, target } = damage;

        const { hp } = target.components;

        if (!hp) {
            return;
        }

        const absoluteAmount = damage.type === 'heal' ? damage.amount : -damage.amount;

        const newHp = Math.min(Math.max(0, hp.current + absoluteAmount), hp.max);

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
