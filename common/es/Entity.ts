import { Opaque } from '../util/Opaque';
import { EntitySetter } from './EntityContainer';

export type EntityId = Opaque<number, 'EntityId'>;

export class Entity<T> {
    constructor(readonly id: EntityId, readonly components: Readonly<Partial<T>>, private setter: EntitySetter<T>) {
    }

    set<K extends keyof T>(key: K, value: T[K]) {
        this.setter.set(this, key, value);
    }

    unset(key: keyof T) {
        this.setter.unset(this, key);
    }
}
