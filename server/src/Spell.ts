import { Expression } from './Expressions';

export interface Spell {
    name: string;
    effects: SpellEffect[];
}

export type EffectTarget = 'caster' | 'target';

export interface BaseEffect {
    target: EffectTarget;
}

export interface HealEffect extends BaseEffect {
    type: 'heal';
    amount: number;
}

export interface DamageEffect extends BaseEffect {
    type: 'damage';
    amount: number;
}

export interface DestroyEffect extends BaseEffect {
    type: 'destroy';
}

export interface ChatEffect extends BaseEffect {
    type: 'chat';
    text: Expression<string>;
}

export type SpellEffect = HealEffect | DamageEffect | DestroyEffect | ChatEffect;

export interface Spells { [id: string]: Spell }
