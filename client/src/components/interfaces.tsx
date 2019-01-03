import { CSSProperties } from 'react';

export type WithStyles<T extends string> = {
    classes: { [P in T]: string };
    theme?:object;
};

type NestableProperties = CSSProperties | { [selector: string]: NestableProperties };

export type StyleRules<ClassKey extends string = string> = {
    [P in ClassKey]: NestableProperties;
} & {
    '@global'?: NestableProperties;
};