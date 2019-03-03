import * as React from 'react';

export interface EditProps<T> {
    value: T;
    onChange: (value: T) => void;
}

export type EditComponent<T> = React.ComponentType<EditProps<T>>;
