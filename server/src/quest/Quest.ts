import { QuestBase, QuestId } from '../../../common/domain/InteractionTable';
import { NonEmptyArray } from '../../../common/util/NonEmptyArray';
import { EntityEvent } from '../entity/Entity';

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

export function matchesEvent(task: Task, event: EntityEvent) {
    switch (event.type) {
        case 'area':
            return task.type === 'visit' && task.areaName === event.name;
        case 'kill':
            return task.type === 'kill' && task.monsterNames.indexOf(event.name) !== -1;
    }
    return false;
}
