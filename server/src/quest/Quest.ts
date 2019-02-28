import { QuestBase, QuestId } from '../../../common/domain/InteractionTable';
import { NonEmptyArray } from '../../../common/util/Types';

interface BaseTask {
    type: string;
    count: number;
    title: string;
}

interface VisitAreaTask extends BaseTask {
    type: 'visit';
    areaName: string;
}

interface KillTask extends BaseTask {
    type: 'kill';
    npcIds: string[];
}

interface SpellTask extends BaseTask {
    type: 'spell';
    spellIds: string[];
}

interface ItemTask extends BaseTask {
    type: 'item';
}

export type Task = VisitAreaTask | KillTask | ItemTask | SpellTask;

export interface Tasks {
    progress: string;
    list: NonEmptyArray<Task>;
}

export type QuestDifficulty = 'easy' | 'normal' | 'hard';

export interface Quest extends QuestBase {
    difficulty: QuestDifficulty;
    startsAt: string;
    endsAt: string;
    requires: QuestId[];
    tasks?: Tasks;
}
