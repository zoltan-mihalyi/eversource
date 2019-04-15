import { QuestId } from '../../common/domain/InteractionTable';
import { ServerComponents } from './es/ServerComponents';
import { Entity } from '../../common/es/Entity';
import { Tasks } from './quest/Quest';
import { DataContainer } from './data/DataContainer';

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
            quests.questLog.forEach((status, questId) => {
                if (status === 'failed') {
                    return;
                }

                const quest = questIndexer.quests.get(questId)!;

                if (!quest.tasks) {
                    return;
                }
                remaining = Math.max(remaining, getRemaining(quest.tasks, status));
            });
            return remaining;
        }
    }
}
