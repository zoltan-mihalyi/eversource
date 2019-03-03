import { EntityContainer } from '../../../common/es/EntityContainer';
import { EventBus } from '../../../common/es/EventBus';
import { QuestLog, ServerComponents } from '../../src/es/ServerComponents';
import { ServerEvents } from '../../src/es/ServerEvents';
import * as assert from 'assert';
import { questSystem } from '../../src/es/QuestSystem';
import { QuestId } from '../../../common/domain/InteractionTable';
import { QuestStatus } from '../../src/character/CharacterDetails';
import { Entity } from '../../../common/es/Entity';
import { ServerEntityContainer } from '../../src/es/ServerEntityContainer';


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
        questLog.set(1 as QuestId, [0]); // TODO mock quests

        questSystem(eventBus, {});

        eventBus.emit('kill', {
            killer: player,
            killed: container.createEntity({ npcId: 'slime_lava' }),
        });

        assert.strictEqual(questLog.get(1 as QuestId)![0], 1);
    });

    it('should do nothing with complete tasks', async function () {
        questLog.set(1 as QuestId, [10]); // TODO mock quests

        questSystem(eventBus, {});

        eventBus.emit('kill', {
            killer: player,
            killed: container.createEntity({ npcId: 'slime_lava' }),
        });

        assert.strictEqual(questLog.get(1 as QuestId)![0], 10);
    });

    it('should do nothing with failed quests', async function () {
        questLog.set(1 as QuestId, 'failed'); // TODO mock quests

        questSystem(eventBus, {});

        eventBus.emit('kill', {
            killer: player,
            killed: container.createEntity({ npcId: 'slime_lava' }),
        });

        assert.strictEqual(questLog.get(1 as QuestId), 'failed');
    });

    it('should handle area events', async function () {
        questLog.set(6 as QuestId, [0]); // TODO mock quests

        questSystem(eventBus, {});

        eventBus.emit('area', {
            visitor: player,
            name: 'slimes',
        });

        assert.strictEqual(questLog.get(6 as QuestId)![0], 1);
    });
});
