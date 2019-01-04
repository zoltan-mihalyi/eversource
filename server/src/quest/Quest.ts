import { QuestBase, QuestId, TaskInfo } from '../../../common/domain/InteractionTable';
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

export interface Quest extends QuestBase {
    startsAt: string;
    endsAt: string;
    requires: QuestId[];
    tasks?: Tasks;
}
