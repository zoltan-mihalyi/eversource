import { Diff } from '../../../../common/protocol/Diff';
import { Diffable } from './Diffable';

export class DynamicDiffable<ID, DATA> extends Diffable<ReadonlyMap<ID, DATA>, Diff<ID, DATA>[], ID, DATA> {
    constructor() {
        super(new Map<ID, DATA>());
    }

    protected createDiffs(): Diff<ID, DATA>[] {
        return [];
    }

    protected addCreate(diffs: Diff<ID, DATA>[], key: ID, value: DATA): void {
        diffs.push({
            id: key,
            type: 'create',
            data: value,
        });
    }

    protected addChange(diffs: Diff<ID, DATA>[], key: ID, changes: Partial<DATA>): void {
        diffs.push({ type: 'change', id: key, changes });
    }

    protected addRemove(diffs: Diff<ID, DATA>[], key: ID): void {
        diffs.push({ type: 'remove', id: key });
    }

    protected get(full: Map<ID, DATA>, key: ID): DATA | undefined {
        return full.get(key);
    }

    protected forEach(full: Map<ID, DATA>, cb: (value: DATA, key: ID) => void) {
        full.forEach(cb);
    }
}

export function mapDiffs<ID, T, R>(diffs: Diff<ID, T>[], mapper: (data: Partial<T>, id:ID) => Partial<R>): Diff<ID, R>[] {
    return diffs.map((diff): Diff<ID, R> => {
        switch (diff.type) {
            case 'remove':
                return diff;
            case 'create':
                return {
                    ...diff,
                    data: mapper(diff.data, diff.id) as R // TODO
                };
            case 'change':
                return {
                    ...diff,
                    changes: mapper(diff.changes, diff.id)
                };
        }
    });
}
