import { QuestId } from '../../../common/domain/InteractionTable';

interface BaseTask {
    count: number;
}

interface VisitAreaTask extends BaseTask {
    type: 'visit';
    name: string;
}

interface KillTask extends BaseTask {
    type: 'kill';
}

type Task = VisitAreaTask;

export interface Quest {
    id: QuestId;
    name: string;
    startsAt: string;
    endsAt: string;
    description: string;
    requires: QuestId[];
    tasks: Task[];
}
