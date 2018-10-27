import { QuestId } from '../../../common/domain/InteractionTable';

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

export interface Quest {
    id: QuestId;
    name: string;
    startsAt: string;
    endsAt: string;
    description: string;
    completion: string;
    requires: QuestId[];
    tasks: Task[];
}
