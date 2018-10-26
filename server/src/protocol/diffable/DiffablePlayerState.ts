import { PlayerState } from '../../../../common/protocol/PlayerState';
import { PlayerStateDiff } from '../../../../common/protocol/Messages';
import { Diffable } from './Diffable';

type PlayerStateValue = PlayerState[keyof PlayerState]

export class DiffablePlayerState extends Diffable<PlayerState, PlayerStateDiff, keyof PlayerState, PlayerStateValue> {
    constructor() {
        super({ interaction: null, character: null });
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
