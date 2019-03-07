import { Expression } from '../src/Expressions';

export interface Spell {
    name: string;
    effects: SpellEffect[];
}

type EffectTarget = 'caster' | 'target';

interface BaseEffect {
    type: string;
    target: EffectTarget;
}

interface HealEffect extends BaseEffect {
    type: 'heal';
    amount: number;
}

interface DestroyEffect extends BaseEffect {
    type: 'destroy';
}

interface ChatEffect extends BaseEffect {
    type: 'chat';
    text: Expression<string>;
}

type SpellEffect = HealEffect | DestroyEffect | ChatEffect;

const SPELLS: { [id: string]: Spell } = {
    consume_vegetable: {
        name: 'Consume vegetable',
        effects: [{
            type: 'heal',
            amount: 10,
            target: 'caster',
        }, {
            type: 'destroy',
            target: 'target',
        }, {
            type: 'chat',
            target: 'caster',
            text: {
                type: 'randomOption',
                values: [{
                    type: 'constant',
                    value: 'Delicious!',
                }, {
                    type: 'constant',
                    value: 'Tasty!',
                }, {
                    type: 'constant',
                    value: 'Juicy!',
                }],
            },
        }],
    },
};

export function getSpell(spellId: string) {
    const spell = SPELLS[spellId];
    if (!spell) {
        throw new Error(`Spell not found: ${spellId}`);
    }
    return spell;
}
