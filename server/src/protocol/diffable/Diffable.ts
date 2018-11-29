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

export abstract class Diffable<F, D, K, V> {
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
