import { Entity, EntityId } from './Entity';
import { PartialPick, Writable } from '../util/Types';

export interface Query<T, K extends keyof T> {
    forEach(cb: (components: PartialPick<T, K>, entity: Entity<T>) => void): void;
}


class QueryImpl<T, K extends keyof T> implements Query<T, K> {
    private entities = new Map<Entity<T>, PartialPick<T, K>>();

    constructor(all: Map<EntityId, Entity<T>>, private keys: ReadonlyArray<(keyof T)>) {
        all.forEach((entity) => this.addIfMatch(entity));
    }

    forEach(cb: (components: PartialPick<T, K>, entity: Entity<T>) => void): void {
        this.entities.forEach(cb);
    }

    addIfMatch(entity: Entity<T>) {
        const { components } = entity;

        for (const key of this.keys) {
            if (!components[key]) {
                return;
            }
        }

        this.entities.set(entity, components as PartialPick<T, K>);
    }

    remove(entity: Entity<T>) {
        this.entities.delete(entity);
    }
}

export interface EntitySetter<T> {
    set<K extends keyof T>(entity: Entity<T>, key: K, value: T[K]): void;

    unset(entity: Entity<T>, key: keyof T): void;
}

class EntitySetterImpl<T> implements EntitySetter<T> {

    constructor(private queriesByType: Map<keyof T, QueryImpl<T, never>[]>) {
    }

    set<K extends keyof T>(entity: Entity<T>, key: K, value: any): void {
        const components = entity.components as Writable<typeof entity.components>;

        const added = !components[key];
        components[key] = value;

        if (!added) {
            return;
        }

        const queries = this.queriesByType.get(key);
        if (!queries) {
            return;
        }

        for (const query of queries) {
            query.addIfMatch(entity);
        }
    }

    unset(entity: Entity<T>, key: keyof T): void {
        const components = entity.components as Writable<typeof entity.components>;

        if (!components[key]) {
            return;
        }
        delete components[key];

        const queries = this.queriesByType.get(key);
        if (!queries) {
            return;
        }

        for (const query of queries) {
            query.remove(entity);
        }
    }
}

let nextId = 0;

export class EntityContainer<T> {
    private entities = new Map<EntityId, Entity<T>>();
    private queriesByType = new Map<keyof T, QueryImpl<T, never>[]>();
    private entitySetter = new EntitySetterImpl(this.queriesByType);

    createEntity(template?: Partial<T>): Entity<T> {
        const id = nextId++ as EntityId;

        const entity = new Entity<T>(id, { ...template as any }, this.entitySetter);
        this.queriesByType.forEach(queries => {
            for (const query of queries) {
                query.addIfMatch(entity); // TODO maybe it is added already
            }
        });

        this.entities.set(id, entity);
        return entity;
    }

    removeEntity(entity: Entity<T>) {
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
