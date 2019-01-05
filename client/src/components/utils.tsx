import originalInjectSheet from 'react-jss';
import { StyleRules, WithStyles } from './interfaces';
import * as React from 'react';
import { Omit } from '../../../common/util/Omit';

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

export const SMALLEST_DEVICE = '@media (max-width: 380px)';