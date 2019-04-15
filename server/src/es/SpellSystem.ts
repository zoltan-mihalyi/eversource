import { ServerEvents } from './ServerEvents';
import { EventBus } from '../../../common/es/EventBus';
import { Expression } from '../Expressions';
import { conditionMet } from '../Condition';
import { Tasks } from '../quest/Quest';
import { DataContainer } from '../data/DataContainer';
import { spellMatchesTask } from './QuestSystem';
import { Spell, SpellEffect } from '../Spell';
import { Entity } from '../../../common/es/Entity';
import { ServerComponents } from './ServerComponents';


export function spellSystem(eventBus: EventBus<ServerEvents>, dataContainer: DataContainer) {
    eventBus.on('trySpellCast', ({ caster, target, spell }) => {
        if (!spellConditionMet(dataContainer, caster, spell)) {
            return;
        }

        for (const effect of spell.effects) {
            const effectTarget = effect.target === 'caster' ? caster : target;

            applyEffect(effect, eventBus, caster, effectTarget);
        }

        eventBus.emit('spellCast', { caster, target, spell });
    });
}

function applyEffect(effect: SpellEffect, eventBus: EventBus<ServerEvents>,
                     caster: Entity<ServerComponents>, effectTarget: Entity<ServerComponents>) {

    switch (effect.type) {
        case 'heal':
            eventBus.emit('damage', {
                source: caster,
                target: effectTarget,
                type: 'heal',
                amount: effect.amount,
            });
            break;
        case 'damage':
            eventBus.emit('damage', {
                source: caster,
                target: effectTarget,
                type: 'physical',
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

function spellConditionMet(dataContainer: DataContainer, caster: Entity<ServerComponents>, spell: Spell): boolean {
    if (!spell.condition) {
        return true;
    }

    const getRemainingSpellCount = (tasks: Tasks, status: ReadonlyArray<number>): number => {
        let remainingCount = 0;
        for (let i = 0; i < tasks.list.length; i++) {
            const task = tasks.list[i];
            if (spellMatchesTask(task, spell)) {
                remainingCount = Math.max(remainingCount, task.count - status[i]);
            }
        }
        return remainingCount;
    };

    return conditionMet(spell.condition, caster, dataContainer, getRemainingSpellCount);
}


function evaluate<T>(expression: Expression<T>): T {
    switch (expression.type) {
        case 'constant':
            return expression.value;
        case 'randomOption':
            return evaluate(expression.values[Math.floor(Math.random() * expression.values.length)]);
    }
}
