import { ServerEvents } from './ServerEvents';
import { EventBus } from '../../../common/es/EventBus';

export function spellSystem(eventBus: EventBus<ServerEvents>) {
    eventBus.on('spellCast', ({ caster, target, spell }) => {
        for (const effect of spell.effects) {
            switch (effect.type) {
                case 'heal': {
                    const healTarget = effect.target === 'caster' ? caster : target;

                    eventBus.emit('damage', { source: caster, target: healTarget, type: 'heal', amount: effect.amount });
                }
            }
        }
    });
}

