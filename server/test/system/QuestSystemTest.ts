import { EventBus } from '../../../common/es/EventBus';
import { ServerComponents } from '../../src/es/ServerComponents';
import { ServerEvents } from '../../src/es/ServerEvents';
import * as assert from 'assert';
import { questSystem } from '../../src/es/QuestSystem';
import { QuestId } from '../../../common/domain/InteractionTable';
import { Entity } from '../../../common/es/Entity';
import { ServerEntityContainer } from '../../src/es/ServerEntityContainer';
import { PresetQuest } from '../../src/quest/Quest';
import { QuestIndexer } from '../../src/quest/QuestIndexer';
import { fakeDataContainer } from '../sampleData';
import { QuestLog, QuestStatus } from '../../src/quest/QuestLog';

const quests: { [key: number]: PresetQuest } = {
    1: {
        "level": 1,
        "difficulty": "normal",
        "name": "A simple quest",
        "startsAt": "cacal",
        "endsAt": "cacal",
        "description": "The lava slimes are causing so much trouble these days!",
        "taskDescription": "Lava slimes live near lava holes. Get rid of them!",
        "completion": "Wasn't that hard, was it?",
        "requires": [
            7 as QuestId,
        ],
        "tasks": {
            "progress": "Have you slain the lava slimes, %class%?",
            "list": [
                {
                    "type": "kill",
                    "count": 10,
                    "track": { "title": "Intruders slain" },
                    "npcIds": [
                        "slime_lava",
                        "slime_lava_rock",
                    ],
                },
            ],
            "requirements": [],
        },
    },
    6: {
        "level": 4,
        "difficulty": "normal",
        "name": "Strange guests",
        "startsAt": "dark",
        "endsAt": "protector",
        "description": "Investigate the lava slimes!",
        "taskDescription": "There are a bunch of lava slimes eastward. Find them!",
        "completion": "Hmm, interesting.",
        "requires": [],
        "tasks": {
            "progress": "Have you find them, %name%?",
            "list": [
                {
                    "count": 1,
                    "type": "visit",
                    "areaName": "slimes",
                    "track": { "title": "Visit eastern slimes" },
                },
            ],
            "requirements": [],
        },
    },
};
let questIndexer = new QuestIndexer(quests, {});
let dataContainer = fakeDataContainer({ questIndexer });

describe('QuestSystem', function () {
    let container: ServerEntityContainer;
    let eventBus: EventBus<ServerEvents>;
    let questLog: QuestLog;
    let questsDone: Set<QuestId>;
    let player: Entity<ServerComponents>;

    beforeEach(() => {
        container = new ServerEntityContainer();
        eventBus = new EventBus<ServerEvents>();
        questLog = new Map<QuestId, QuestStatus>();
        questsDone = new Set<QuestId>();
        player = container.createEntity({
            quests: {
                questLog,
                questsDone,
            },
        });
    });

    it('should add task progression', async function () {
        questLog.set(1 as QuestId, [0]);

        questSystem(eventBus, dataContainer);

        eventBus.emit('kill', {
            killer: player,
            killed: container.createEntity({ npcId: 'slime_lava' }),
        });

        assert.strictEqual(questLog.get(1 as QuestId)![0], 1);
    });

    it('should do nothing with complete tasks', async function () {
        questLog.set(1 as QuestId, [10]);

        questSystem(eventBus, dataContainer);

        eventBus.emit('kill', {
            killer: player,
            killed: container.createEntity({ npcId: 'slime_lava' }),
        });

        assert.strictEqual(questLog.get(1 as QuestId)![0], 10);
    });

    it('should do nothing with failed quests', async function () {
        questLog.set(1 as QuestId, 'failed');

        questSystem(eventBus, dataContainer);

        eventBus.emit('kill', {
            killer: player,
            killed: container.createEntity({ npcId: 'slime_lava' }),
        });

        assert.strictEqual(questLog.get(1 as QuestId), 'failed');
    });

    it('should handle area events', async function () {
        questLog.set(6 as QuestId, [0]);

        questSystem(eventBus, dataContainer);

        eventBus.emit('area', {
            visitor: player,
            name: 'slimes',
        });

        assert.strictEqual(questLog.get(6 as QuestId)![0], 1);
    });
});
