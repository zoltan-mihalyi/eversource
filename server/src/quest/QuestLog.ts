import { QuestId } from '../../../common/domain/InteractionTable';
import { QuestIndexer } from './QuestIndexer';
import { Tasks } from './Quest';

export type QuestProgression = ReadonlyArray<number>;

export type QuestStatus = 'failed' | QuestProgression;

export type QuestLog = Map<QuestId, QuestStatus>;

export function getCurrentTasks(questLog: QuestLog, questIndexer: QuestIndexer): Tasks[] {
    const result: Tasks[] = [];

    forEachCurrentTasks(questLog, questIndexer, tasks => result.push(tasks));

    return result;
}

export function forEachCurrentTasks(questLog: QuestLog, questIndexer: QuestIndexer, cb: (tasks: Tasks, questId: QuestId, progression: QuestProgression) => void) {
    questLog.forEach((questStatus, questId) => {
        if (questStatus === 'failed') {
            return;
        }
        const tasks = questIndexer.quests.get(questId)!.tasks;
        if (!tasks) {
            return;
        }

        cb(tasks, questId, questStatus);
    });

}
