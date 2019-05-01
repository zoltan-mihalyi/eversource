import { QuestId } from '../../common/domain/InteractionTable';
import { ServerComponents } from './es/ServerComponents';
import { Entity } from '../../common/es/Entity';
import { Tasks } from './quest/Quest';
import { DataContainer } from './data/DataContainer';
import { forEachCurrentTasks } from './quest/QuestLog';

export interface QuestCondition {
    type: 'quest';
    questId: QuestId;
}

export interface TaskCondition {
    type: 'task';
}

export type Condition = QuestCondition | TaskCondition;

export type GetRemaining = (tasks: Tasks, status: ReadonlyArray<number>) => number;

export function conditionMet(condition: Condition, entity: Entity<ServerComponents>, dataContainer: DataContainer, getRemaining: GetRemaining): boolean {
    return getRemainingCount(condition, entity, dataContainer, getRemaining) > 0;
}

export function getRemainingCount(condition: Condition, entity: Entity<ServerComponents>, { questIndexer }: DataContainer, getRemaining: GetRemaining): number {
    const { quests } = entity.components;

    if (!quests) {
        return 0;
    }

    switch (condition.type) {
        case 'quest':
            return quests.questLog.has(condition.questId) ? Infinity : 0;
        case 'task': {
            let remaining = 0;
            forEachCurrentTasks(quests.questLog, questIndexer, ((tasks, questId, progression) => {
                remaining = Math.max(remaining, getRemaining(tasks, progression));
            }));
            return remaining;
        }
    }
}
