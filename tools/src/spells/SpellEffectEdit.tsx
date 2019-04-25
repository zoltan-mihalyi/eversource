import * as React from 'react';
import { AnimationEffect, ChatEffect, DamageEffect, DestroyEffect, HealEffect, SpellEffect } from '../../../server/src/Spell';
import { unionEdit } from '../components/edit/UnionEdit';
import { objectEdit, PropertyConfig } from '../components/edit/ObjectEdit';
import { NumberEdit } from '../components/edit/NumberEdit';
import { StringExpressionEdit } from './ExpressionEdit';
import { optionEdit } from '../components/edit/OptionEdit';
import { EditComponent } from '../components/edit/Edit';
import { Omit } from '../../../common/util/Omit';
import { TextEdit } from '../components/edit/TextEdit';

const TargetEdit = optionEdit(['target', 'caster']);

function spellEffectEdit<T extends SpellEffect, K extends keyof T = never>(config: PropertyConfig<Omit<T, 'type' | 'target'>>): EditComponent<T> {
    return objectEdit<T, 'type' | K>({
        target: { component: TargetEdit },
        ...config as any,
    });
}

export const SpellEffectEdit = unionEdit<SpellEffect>({
    heal: {
        component: () => spellEffectEdit<HealEffect>({
            amount: { component: NumberEdit }
        }),
        defaultValue: { type: 'heal', target: 'target', amount: 100 }
    },
    damage: {
        component: () => spellEffectEdit<DamageEffect>({
            amount: { component: NumberEdit }
        }),
        defaultValue: { type: 'damage', target: 'target', amount: 100 }
    },
    destroy: {
        component: () => spellEffectEdit<DestroyEffect>({}),
        defaultValue: { type: 'destroy', target: 'target' }
    },
    chat: {
        component: () => spellEffectEdit<ChatEffect>({
            text: { component: StringExpressionEdit },
        }),
        defaultValue: { type: 'chat', target: 'target', text: { type: 'constant', value: 'Hello!' } }
    },
    animation: {
        component: () => spellEffectEdit<AnimationEffect>({
            image: { component: TextEdit },
            animation: { component: TextEdit },
        }),
        defaultValue: { type: 'animation', target: 'target', image: 'heal3', animation: 'heal3' }
    }
});
