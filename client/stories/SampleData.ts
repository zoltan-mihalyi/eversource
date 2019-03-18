import { InteractionTable, QuestId, QuestInfo } from '../../common/domain/InteractionTable';
import { QuestLogItem } from '../../common/protocol/QuestLogItem';
import { QuestStatus } from '../../server/src/character/CharacterDetails';
import { EntityId } from '../../common/es/Entity';
import { CharacterState } from '../../common/protocol/PlayerState';
import { ItemInfo } from '../../common/protocol/ItemInfo';
import { TextureLoader } from '../src/loader/TextureLoader';
import { app } from './TestScreen';
import { CancellableProcess } from '../../common/util/CancellableProcess';
import { ItemId } from '../../common/protocol/Inventory';
import { PlayingNetworkApi } from '../src/protocol/PlayingState';

function noop() {
}

const ITEM_INFO: ItemInfo = {
    id: 0 as ItemId,
    name: 'Sting of the Queen Bee',
    image: 'plants',
    animation: 'carrot',
    count: 1,
    questItem: true,
    quality: 'rare',
    lore: 'Be careful, it is dangerous!',
};

export function questInfo(id: number, name: string, extra?: Partial<QuestInfo>): QuestInfo {
    return {
        id: id as QuestId,
        level: 5,
        xpReward: 40,
        name,
        tasks: [
            { count: 10, track: { title: 'Intruders slain' } },
            { count: 1 }, // hidden
            { count: 1, track: { title: 'Area explored' } },
        ],
        requirements: [{ item: ITEM_INFO }],
        completion: 'Good job, %name%! You are a good %sex%!',
        description: 'The lava slimes are causing so much trouble these days! We need an experienced %class% to solve this.',
        taskDescription: 'Slay the intruders and explore the area!',
        progress: 'Come back once you are done!',
        ...extra,
    };
}

function questLogItem(id: number, name: string, status: QuestStatus, extra?: Partial<QuestInfo>): QuestLogItem {
    return {
        status,
        info: questInfo(id, name, extra),
    };
}

export const INTERACTIONS: InteractionTable = {
    name: 'Knight',
    story: 'Hello, %name%! I have a responsible job. But sometimes I need help.',
    acceptable: [questInfo(1, 'Acceptable')],
    completable: [questInfo(2, 'Completable')],
    completableLater: [questInfo(3, 'Completable later')],
    entityId: 1 as EntityId,
};

export const QUEST_LOG = new Map<QuestId, QuestLogItem>();

QUEST_LOG.set(1 as QuestId, questLogItem(1, 'A simple quest', [1, 1, 0]));
QUEST_LOG.set(2 as QuestId, questLogItem(2, 'Completed quest', [10, 1, 1]));
QUEST_LOG.set(3 as QuestId, questLogItem(3, 'A mysterious quest with a very long name', [10, 1, 0], { level: 56 }));
QUEST_LOG.set(4 as QuestId, questLogItem(4, 'A Failed quest', 'failed', { level: 8 }));
QUEST_LOG.set(5 as QuestId, questLogItem(5, 'A quest with long task', [8, 1, 1], {
    level: 12,
    tasks: [{
        track: { title: 'A bit longer task name' },
        count: 32,
    }, {
        track: { title: 'An unnecessarily long task name' },
        count: 150,
    }],
}));
QUEST_LOG.set(6 as QuestId, questLogItem(6, 'A low level quest', [0, 1, 0], { level: 2 }));
QUEST_LOG.set(7 as QuestId, questLogItem(7, 'A very low level quest', [0, 1, 0], { level: 1 }));
QUEST_LOG.set(8 as QuestId, questLogItem(8, 'Hidden task not completed', [10, 0, 1]));

export const CHARACTER_STATE: CharacterState = {
    level: 6,
    classId: 'warrior',
    name: 'John',
    sex: 'male',
    xp: 100,
    inventorySize: 10,
};

export const FAKE_API: PlayingNetworkApi = {
    interact: noop,
    acceptQuest: noop,
    abandonQuest: noop,
    closeInteraction: noop,
    leaveGame: noop,
    move: noop,
    completeQuest: noop,
    sendChatMessage: noop,
};

export const textureLoader = new TextureLoader(app.renderer, new CancellableProcess(), 32);
