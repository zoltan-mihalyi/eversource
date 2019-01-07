import { QuestBase, QuestId } from '../../../common/domain/InteractionTable';
import { NonEmptyArray } from '../../../common/util/NonEmptyArray';

interface BaseTask {
    count: number;
    title: string;
}

interface VisitAreaTask extends BaseTask {
    type: 'visit';
    areaName: string;
}

interface KillTask extends BaseTask {
    type: 'kill';
    monsterNames: string[];
}

interface ItemTask extends BaseTask {
    type: 'item';
}

type Task = VisitAreaTask | KillTask | ItemTask;

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

export function matchesEvent(task: Task, eventType: string, payload?: any) {
    switch (eventType) {
        case 'area':
            return task.type === 'visit' && task.areaName === payload;
        case 'kill':
            return task.type === 'kill' && task.monsterNames.indexOf(payload) !== -1;
    }
    return false;
}