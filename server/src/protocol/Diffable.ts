import { Diff } from '../../../common/protocol/Diff';
import { EntityData } from '../../../common/domain/EntityData';
import { Entity } from '../entity/Entity';
import { PlayerState } from '../../../common/protocol/PlayerState';
import { PlayerStateDiff } from '../../../common/protocol/Messages';

function equals<T>(previousObject: T, currentObject: T, key: keyof T): boolean {
    const previous = previousObject[key];
    const current = currentObject[key];

    if (previous === current) {
        return true;
    }

    if (Array.isArray(previous) && Array.isArray(current)) {
        if (previous.length !== current.length) {
            return false;
        }
        for (let i = 0; i < previous.length; i++) {
            if (previous[i] !== current[i]) {
                return false;
            }
        }
        return true;
    }

    return false;
}

abstract class Diffable<F, D, K, V> {
    constructor(private full: F) {
    }

    update(newData: F): D | null {
        const diffs = this.createDiffs();
        let hasAnyDiff = false;

        this.forEach(newData, ((value, key) => {
            const previousObject = this.get(this.full, key);
            if (previousObject === void 0) {
                hasAnyDiff = true;
                this.addCreate(diffs, key, value);
            } else if (value === null || previousObject === null) {
                if (previousObject !== value) {
                    hasAnyDiff = true;
                    this.addChange(diffs, key, value);
                }
            } else {
                let hasDiff = false;
                const changes: Partial<V> = {};

                for (const key of Object.keys(value) as (keyof V)[]) {
                    if (!equals(previousObject, value, key)) {
                        hasDiff = true;
                        changes[key] = value[key];
                    }
                }
                if (hasDiff) {
                    hasAnyDiff = true;
                    this.addChange(diffs, key, changes);
                }
            }
        }));

        this.forEach(this.full, (value, key) => {
            if (this.get(newData, key) === void 0) {
                hasAnyDiff = true;
                this.addRemove(diffs, key);
            }
        });

        this.full = newData;

        return hasAnyDiff ? diffs : null;
    }

    protected abstract createDiffs(): D;

    protected abstract addCreate(diffs: D, key: K, value: V): void;

    protected abstract addChange(diffs: D, key: K, changes: Partial<V> | null): void;

    protected abstract addRemove(diffs: D, key: K): void;

    protected abstract get(full: F, key: K): V | undefined;

    protected abstract forEach(full: F, cb: (value: V, key: K) => void): void;
}

export class DiffableEntities extends Diffable<Map<Entity, EntityData>, Diff[], Entity, EntityData> {
    constructor(private self: Entity) {
        super(new Map<Entity, EntityData>());
    }

    protected createDiffs(): Diff[] {
        return [];
    }


    protected addCreate(diffs: Diff[], key: Entity, value: EntityData): void {
        diffs.push({
            id: key.id,
            type: 'create',
            self: key === this.self,
            data: value,
        });
    }

    protected addChange(diffs: Diff[], key: Entity, changes: Partial<EntityData>): void {
        diffs.push({ type: 'change', id: key.id, changes });
    }

    protected addRemove(diffs: Diff[], key: Entity): void {
        diffs.push({ type: 'remove', id: key.id });
    }

    protected get(full: Map<Entity, EntityData>, key: Entity): EntityData | undefined {
        return full.get(key);
    }

    protected forEach(full: Map<Entity, EntityData>, cb: (value: EntityData, key: Entity) => void) {
        full.forEach(cb);
    }
}


type PlayerStateValue = PlayerState[keyof PlayerState]

export class DiffablePlayerState extends Diffable<PlayerState, PlayerStateDiff, keyof PlayerState, PlayerStateValue> {
    constructor() {
        super({ interaction: null });
    }

    protected createDiffs(): PlayerStateDiff {
        return {};
    }

    protected addCreate(diffs: PlayerStateDiff, key: keyof PlayerState, value: PlayerStateValue): void {
        throw new Error('Not supported!');
    }

    protected addChange(diffs: PlayerStateDiff, key: keyof PlayerState, changes: Partial<PlayerStateValue>): void {
        diffs[key] = changes;
    }

    protected addRemove(diffs: PlayerStateDiff, key: keyof PlayerState): void {
        throw new Error('Not supported!');
    }

    protected get(full: PlayerState, key: keyof PlayerState): PlayerStateValue | undefined {
        return full[key];
    }

    protected forEach(full: PlayerState, cb: (value: PlayerStateValue, key: keyof PlayerState) => void): void {
        for (const key of Object.keys(full) as (keyof PlayerState)[]) {
            cb(full[key], key);
        }
    }
}
