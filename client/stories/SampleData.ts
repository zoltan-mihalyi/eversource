import { InteractionTable, QuestId, QuestInfo } from '../../common/domain/InteractionTable';
import { EntityId } from '../../common/domain/EntityData';
import { QuestLogItem } from '../../common/protocol/QuestLogItem';
import { QuestStatus } from '../../server/src/character/CharacterDetails';

export function questInfo(id: number, name: string): QuestInfo {
    return {
        id: id as QuestId,
        name,
        tasks: [{ count: 10, title: 'Intruders slain' }, { count: 1, title: 'Area explored' }],
        completion: 'Good job!',
        description: 'The lava slimes are causing so much trouble these days!',
        taskDescription: 'Slay the intruders and explore the area!',
        progress: 'Come back once you are done!',
    };
}

function questLogItem(id: number, name: string, status: QuestStatus): QuestLogItem {
    return {
        status,
        info: questInfo(id, name),
    };
}

export const INTERACTIONS: InteractionTable = {
    name: 'Knight',
    acceptable: [questInfo(1, 'Acceptable')],
    completable: [questInfo(2, 'Completable')],
    completableLater: [questInfo(3, 'Completable later')],
    entityId: 1 as EntityId,
};

export const QUEST_LOG = new Map<QuestId, QuestLogItem>();

QUEST_LOG.set(1 as QuestId, questLogItem(1, 'A simple quest', [1, 0]));
QUEST_LOG.set(2 as QuestId, questLogItem(2, 'Completed quest', [10, 1]));
QUEST_LOG.set(3 as QuestId, questLogItem(3, 'A mysterious quest with a very long name', [10, 0]));
QUEST_LOG.set(4 as QuestId, questLogItem(4, 'A Failed quest', 'failed'));
const longTask = questLogItem(5, 'A quest with long task', [8, 1]);
longTask.info.tasks[0].title='A bit longer task name';
longTask.info.tasks[1].title='An unnecessarily long task name';
QUEST_LOG.set(5 as QuestId, longTask);