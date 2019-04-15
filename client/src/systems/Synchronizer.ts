import { PartialPick } from '../../../common/util/Types';
import { Query } from '../../../common/es/EntityContainer';
import { Entity } from '../../../common/es/Entity';
import { EventBus } from '../../../common/es/EventBus';
import { ClientEvents } from '../es/ClientEvents';

export abstract class Synchronizer<T, K extends keyof T, V> {
    constructor(private keys: (keyof T)[]) {
    }

    keepSync(entities: Query<T, K>, eventBus: EventBus<ClientEvents>) {
        const entityStateMap = new Map<Entity<T>, PartialPick<T, K>>();

        eventBus.on('render', () => {
            entities.forEach((components, entity) => {
                const state = entityStateMap.get(entity);
                if (!state || !this.matches(state, components)) {
                    this.apply(components, this.getValue(components));
                    entityStateMap.set(entity, pick(components, this.keys));
                }
            });
        });

        entities.on('remove', (components, entity) => {
            entityStateMap.delete(entity);
            this.apply(components, this.getEmptyValue());
        });
    }

    private matches(state: PartialPick<T, K>, components: PartialPick<T, K>): boolean {
        for (const key of this.keys) {
            if (state[key] !== components[key]) {
                return false;
            }
        }
        return true;
    }


    abstract getValue(components: PartialPick<T, K>): V;

    abstract getEmptyValue(): V;

    abstract apply(components:PartialPick<T,K>, value: V): void;
}

function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
    const result = {} as Pick<T, K>;
    for (const key of keys) {
        result[key] = obj[key];
    }
    return result;
}