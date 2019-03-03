import * as React from 'react';
import { Spell, SpellEffect } from '../../../server/src/Spell';
import { objectEdit } from '../components/edit/ObjectEdit';
import { TextEdit } from '../components/edit/TextEdit';
import { arrayEdit } from '../components/edit/ArrayEdit';
import { SpellEffectEdit } from './SpellEffectEdit';

const DEFAULT_SPELL_EFFECT: SpellEffect = {
    type: 'heal',
    amount: 100,
    target: 'target'
};

export const SpellEdit = objectEdit<Spell>({
    name: { component: TextEdit },
    effects: { component: arrayEdit<SpellEffect>(DEFAULT_SPELL_EFFECT, SpellEffectEdit) },
});
