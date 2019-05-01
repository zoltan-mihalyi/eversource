import { Expression } from './Expressions';
import { Condition } from './Condition';

export interface PresetSpell {
    name: string;
    condition?: Condition;
    effects: SpellEffect[];
}

export interface Spell extends PresetSpell {
    id: string;
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

export interface AnimationEffect extends BaseEffect {
    type: 'animation';
    image: string;
    animation: string;
}

export interface SoundEffect extends BaseEffect {
    type: 'sound';
    name: string;
    volume: number;
}

export interface ChatEffect extends BaseEffect {
    type: 'chat';
    text: Expression<string>;
}

export type SpellEffect = HealEffect | DamageEffect | DestroyEffect | ChatEffect | AnimationEffect | SoundEffect;

export interface Spells {
    [id: string]: Spell;
}
