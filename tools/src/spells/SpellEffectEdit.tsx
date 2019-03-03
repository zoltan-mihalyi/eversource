import * as React from 'react';
import { ChatEffect, DamageEffect, DestroyEffect, HealEffect, SpellEffect } from '../../../server/src/Spell';
import { unionEdit } from '../components/edit/UnionEdit';
import { objectEdit } from '../components/edit/ObjectEdit';
import { NumberEdit } from '../components/edit/NumberEdit';
import { StringExpressionEdit } from './ExpressionEdit';
import { optionEdit } from '../components/edit/OptionEdit';

const TargetEdit = optionEdit(['target', 'caster']);

export const SpellEffectEdit = unionEdit<SpellEffect>({
    heal: {
        component: () => objectEdit<HealEffect>({
            target: { component: TargetEdit },
            amount: { component: NumberEdit }
        }),
        defaultValue: { type: 'heal', target: 'target', amount: 100 }
    },
    damage: {
        component: () => objectEdit<DamageEffect>({
            target: { component: TargetEdit },
            amount: { component: NumberEdit }
        }),
        defaultValue: { type: 'damage', target: 'target', amount: 100 }
    },
    destroy: {
        component: () => objectEdit<DestroyEffect>({
            target: { component: TargetEdit },
        }),
        defaultValue: { type: 'destroy', target: 'target' }
    },
    chat: {
        component: () => objectEdit<ChatEffect>({
            target: { component: TargetEdit },
            text: { component: StringExpressionEdit },
        }),
        defaultValue: { type: 'chat', target: 'target', text: { type: 'constant', value: 'Hello!' } }

    }
});
