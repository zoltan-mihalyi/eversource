import { Entity, EntityId } from './Entity';
import { PartialPick, Writable } from '../util/Types';

type QueryCallback<T, K extends keyof T> = (components: PartialPick<T, K>, entity: Entity<T>) => void;

export interface Query<T, K extends keyof T> {
    forEach(cb: QueryCallback<T, K>): void;

    on(event: 'add' | 'remove' | 'update', cb: QueryCallback<T, K>): void;
}

interface QueryCallbacks<T, K extends keyof T> {
    add: QueryCallback<T, K>[];
    remove: QueryCallback<T, K>[];
    update: QueryCallback<T, K>[]; //TODO
}

class QueryImpl<T, K extends keyof T> implements Query<T, K> {
    private entities = new Map<Entity<T>, PartialPick<T, K>>();
    private callbacks: QueryCallbacks<T, K> = { add: [], remove: [], update: [] };

    constructor(all: Map<EntityId, Entity<T>>, private keys: ReadonlyArray<(keyof T)>) {
        all.forEach((entity) => this.addIfMatch(entity));
    }

    forEach(cb: QueryCallback<T, K>) {
        this.entities.forEach(cb);
    }

    on(event: 'add' | 'remove' | 'update', cb: QueryCallback<T, K>) {
        this.callbacks[event].push(cb);
    }

    addIfMatch(entity: Entity<T>) {
        if (this.entities.has(entity)) {
            return;
        }

        const { components } = entity;

        for (const key of this.keys) {
            if (!components[key]) {
                return;
            }
        }

        this.entities.set(entity, components as PartialPick<T, K>);
        for (const cb of this.callbacks.add) {
            cb(components as PartialPick<T, K>, entity);
        }
    }

    updated(entity: Entity<T>) {
        if (!this.entities.has(entity)) {
            return;
        }
        for (const cb of this.callbacks.update) {
            cb(entity.components as PartialPick<T, K>, entity);
        }
    }

    remove(entity: Entity<T>) {
        if (!this.entities.has(entity)) {
            return;
        }
        this.entities.delete(entity);
        for (const cb of this.callbacks.remove) {
            cb(entity.components as PartialPick<T, K>, entity);
        }
    }
}

export interface EntitySetter<T> {
    set<K extends keyof T>(entity: Entity<T>, key: K, value: T[K]): void;

    unset(entity: Entity<T>, key: keyof T): void;
}

class EntitySetterImpl<T> implements EntitySetter<T> {

    constructor(private queriesByType: Map<keyof T, QueryImpl<T, any>[]>) {
    }

    set<K extends keyof T>(entity: Entity<T>, key: K, value: any): void {
        const components = entity.components as Writable<typeof entity.components>;

        const added = !components[key];
        components[key] = value;

        const queries = this.queriesByType.get(key);
        if (!queries) {
            return;
        }
        if (!added) {
            for (const query of queries) {
                query.updated(entity);
            }
        } else {
            for (const query of queries) {
                query.addIfMatch(entity);
            }
        }
    }

    unset(entity: Entity<T>, key: keyof T): void {
        const components = entity.components as Writable<typeof entity.components>;

        if (!components[key]) {
            return;
        }

        const queries = this.queriesByType.get(key);
        if (queries) {
            for (const query of queries) {
                query.remove(entity);
            }
        }

        delete components[key];
    }
}

export class EntityContainer<T> {
    private entities = new Map<EntityId, Entity<T>>();
    private queriesByType = new Map<keyof T, QueryImpl<T, any>[]>();
    private entitySetter = new EntitySetterImpl(this.queriesByType);

    createEntityWithId(id: EntityId, template?: Partial<T>): Entity<T> {

        const entity = new Entity<T>(id, { ...template as any }, this.entitySetter);
        this.queriesByType.forEach(queries => {
            for (const query of queries) {
                query.addIfMatch(entity); // TODO maybe it is added already
            }
        });

        this.entities.set(id, entity);
        return entity;
    }

    removeEntity(entity: Entity<T>) { // TODO handle queries with no components
        const keys = Object.keys(entity.components) as (keyof T)[];

        for (const key of keys) {
            const queriesForType = this.queriesByType.get(key);
            if (!queriesForType) {
                continue;
            }
            for (const query of queriesForType) {
                query.remove(entity);
            }
        }

        this.entities.delete(entity.id);
    }

    getEntity(id: EntityId): Entity<T> | null {
        return this.entities.get(id) || null;
    }

    createQuery<K extends keyof T>(...types: K[]): Query<T, K> {
        const query = new QueryImpl<T, K>(this.entities, types);

        for (const type of types) {
            const queriesForType = this.queriesByType.get(type);

            if (queriesForType) {
                queriesForType.push(query);
            } else {
                this.queriesByType.set(type, [query]);
            }
        }

        return query;
    }
}
