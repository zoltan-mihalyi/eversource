import { QuestId } from '../../../common/domain/InteractionTable';
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
}

interface ItemTask extends BaseTask {
    type: 'item';
}

type Task = VisitAreaTask | KillTask | ItemTask;

export interface Tasks {
    progress: string;
    list: NonEmptyArray<Task>;
}

export interface Quest {
    id: QuestId;
    name: string;
    startsAt: string;
    endsAt: string;
    description: string;
    taskDescription: string;
    completion: string;
    requires: QuestId[];
    tasks?: Tasks;
}
