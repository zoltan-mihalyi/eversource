import { InteractionTable, QuestId, QuestInfo } from '../../common/domain/InteractionTable';
import { QuestLogItem } from '../../common/protocol/QuestLogItem';
import { QuestStatus } from '../../server/src/quest/QuestLog';
import { EntityId } from '../../common/es/Entity';
import { CharacterState } from '../../common/protocol/PlayerState';
import { ItemId, ItemInfo, ItemInfoWithCount } from '../../common/protocol/ItemInfo';
import { TextureLoader } from '../src/loader/TextureLoader';
import { CancellableProcess } from '../../common/util/CancellableProcess';
import { PlayingNetworkApi } from '../src/protocol/PlayingState';
import { CharacterId, CharacterInfo, CharacterName, EquipmentSlotId } from '../../common/domain/CharacterInfo';
import { X, Y, ZoneId } from '../../common/domain/Location';
import { times } from '../src/components/utils';
import * as PIXI from "pixi.js";

export const app = new PIXI.Application();
export const appContainer = new PIXI.Container();
appContainer.x = 400;
appContainer.y = 400;
appContainer.scale.set(4);
app.stage.addChild(appContainer);

function noop() {
}

export const ITEM_INFO: ItemInfo = {
    id: 0 as ItemId,
    name: 'Sting of the Queen Bee',
    image: 'plants',
    animation: 'carrot',
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
        requirements: [{ itemInfo: ITEM_INFO, count: 3 }],
        completion: 'Good job, %name%! You are a good %sex%!',
        description: 'The lava slimes are causing so much trouble these days! We need an experienced %class% to solve this.',
        taskDescription: 'Slay the intruders and explore the area!',
        progress: 'Come back once you are done!',
        rewards: [],
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
    equip: noop,
    unequip: noop,
};

export const textureLoader = new TextureLoader(app.renderer, new CancellableProcess(), 32);

export const CHARACTERS: CharacterInfo[] = times(8, (n): CharacterInfo => ({
    id: n.toString() as CharacterId,
    level: 90,
    classId: 'warrior',
    name: 'UnimaginableTheIncredibleMage' as CharacterName,
    sex: 'female',
    xp: 100,
    hp: 100,
    appearance: null as any,
    equipment: null as any,
    location: {
        zoneId: 'enchanted_forest' as ZoneId,
        position: { x: 0 as X, y: 0 as Y }
    },
}));

export function createEquipmentItem(equipmentSlotId: EquipmentSlotId): ItemInfoWithCount {
    return {
        itemInfo: {
            id: 123 as ItemId,
            name: `Rusty ${equipmentSlotId[0].toUpperCase()}${equipmentSlotId.substring(1)}`,
            equip: {
                slotId: equipmentSlotId,
            },
            image: 'equipment1',
            animation: 'legion-helmet-1-gold',
            quality: 'rare',
            questItem: false,
        },
        count: 1,
    };
}

export function createCustomItem(override?: Partial<ItemInfo>, count = 1): ItemInfoWithCount {
    return {
        itemInfo: {
            id: 123 as ItemId,
            name: 'Legendary Carrot',
            image: 'plants',
            animation: 'carrot',
            quality: 'legendary',
            lore: 'This carrot was enchanted by a wizard.',
            questItem: false,
            ...override,
        },
        count,
    };
}

export function createItem(): ItemInfoWithCount {
    return createCustomItem();
}