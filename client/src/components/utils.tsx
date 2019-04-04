import originalInjectSheet from 'react-jss';
import { StyleRules, WithStyles } from './interfaces';
import * as React from 'react';
import { Omit } from '../../../common/util/Omit';
import { EquipmentSlotId } from '../../../common/domain/CharacterInfo';

export function className(...classes: (string | null | boolean | undefined)[]) {
    return classes.filter(name => name).join(' ');
}

interface Wrapper<T extends string> {
    <P extends WithStyles<T>>(component: React.ComponentType<P>): React.ComponentType<Omit<P, 'classes' | 'theme'>>;
}

export function injectSheet<T extends string>(styles: StyleRules<T>): Wrapper<T> {
    return originalInjectSheet(styles) as any;
}

export const SMALL_DEVICE = '@media (max-width: 1000px)';
export const NOT_SMALL_DEVICE = '@media (min-width: 1001px)';

export const SMALLEST_DEVICE = '@media (max-width: 380px)';

export function times<T>(n: number, fn: (i: number) => T): T[] {
    const result: T[] = [];
    for (let i = 0; i < n; i++) {
        result[i] = fn(i);
    }
    return result;
}

export function equipmentSlotName(equipmentSlotId: EquipmentSlotId): string {
    return equipmentSlotId[0].toUpperCase() + equipmentSlotId.substring(1);
}
