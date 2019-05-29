import { basicAttack } from '../../../common/algorithms';
import { ServerEvents } from './ServerEvents';
import { EventBus } from '../../../common/es/EventBus';
import { tryDispatchPositionEffectAnimation } from './ActionDispatcherSystem';

export function attackSystem(eventBus: EventBus<ServerEvents>) {
    eventBus.on('hit', (hit) => {
        const { weapon, level } = hit.source.components;

        if (weapon && level) {
            eventBus.emit('damage', {
                type: 'physical',
                amount: basicAttack(level.value) + weapon.damage,
                source: hit.source,
                target: hit.target,
            });
            tryDispatchPositionEffectAnimation(eventBus, hit.target, 'slash', 'slash');
        }
    });
}

