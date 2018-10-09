import { QuestId } from '../../../common/domain/InteractionTable';

interface Task {
    count: number;
}

export interface Quest {
    id: QuestId;
    name: string;
    startsAt: string;
    endsAt: string;
    description: string;
    requires: QuestId[];
    tasks: Task[];
}
