export interface Spell {
    name: string;
    effects: SpellEffect[];
}

export type SpellEffect = {
    type: 'heal';
    amount: number;
    target: 'caster';
};

const SPELLS: { [id: string]: Spell } = {
    consume_vegetable: {
        name: 'Consume vegetable',
        effects: [{
            type: 'heal',
            amount: 10,
            target: 'caster'
        }],
    }
};

export function getSpell(spellId: string) {
    const spell = SPELLS[spellId];
    if (!spell) {
        throw new Error(`Spell not found: ${spellId}`);
    }
    return spell;
}
