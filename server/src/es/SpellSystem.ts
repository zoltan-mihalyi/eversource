import { ServerEvents } from './ServerEvents';
import { EventBus } from '../../../common/es/EventBus';
import { Expression } from '../Expressions';

export function spellSystem(eventBus: EventBus<ServerEvents>) {
    eventBus.on('spellCast', ({ caster, target, spell }) => {
        for (const effect of spell.effects) {
            const effectTarget = effect.target === 'caster' ? caster : target;
            switch (effect.type) {
                case 'heal':
                    eventBus.emit('damage', {
                        source: caster,
                        target: effectTarget,
                        type: 'heal',
                        amount: effect.amount,
                    });
                    break;
                case 'destroy':
                    eventBus.emit('kill', { killer: caster, killed: effectTarget });
                    break;
                case 'chat':
                    eventBus.emit('chatMessage', { sender: effectTarget, text: evaluate(effect.text) });
                    break;
            }
        }
    });
}

function evaluate<T>(expression: Expression<T>): T {
    switch (expression.type) {
        case 'constant':
            return expression.value;
        case 'randomOption':
            return evaluate(expression.values[Math.floor(Math.random() * expression.values.length)]);
    }
}