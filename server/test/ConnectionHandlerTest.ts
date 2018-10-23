import { ConnectionHandler } from '../src/protocol/ConnectionHandler';
import { CharacterId, CharacterInfo, CharacterName, ClassId } from '../../common/domain/CharacterInfo';
import { X, Y, ZoneId } from '../../common/domain/Location';
import { UserDao } from '../src/dao/UserDao';
import * as sinon from 'sinon';
import * as assert from 'assert';
import { NetworkLoop } from '../src/NetworkLoop';
import { CharacterDetails, QuestStatus } from '../src/character/CharacterDetails';
import { QuestId } from '../../common/domain/InteractionTable';

function tick(): Promise<void> {
    return new Promise<void>(resolve => setTimeout(resolve, 1));
}

const characters: CharacterInfo[] = [
    {
        name: 'John' as CharacterName,
        id: '1' as CharacterId,
        classId: 'warrior' as ClassId,

        location: {
            position: {
                x: 100 as X,
                y: 100 as Y,
            },
            zoneId: 'lavaland' as ZoneId,
        },
        appearance: {
            sex: 'male',
            body: [''],
            ears: [],
            eyes: [],
            hair: [],
            nose: [],
        },
        equipment: {
            chest: [],
            feet: [],
            head: [],
            legs: [],
            shirt: [],
            arms: [],
            hands: [],
        },
    },
];

const characterDetails: CharacterDetails = {
    info: characters[0],
    questsDone: new Set<QuestId>(),
    questLog: new Map<QuestId, QuestStatus>(),
};

class FakeUserDao implements UserDao {
    getCharacters(): CharacterInfo[] {
        return characters;
    }

    getCharacterIfExists(id: string): CharacterDetails | null {
        if (id !== '1') {
            return null;
        }
        return characterDetails;
    }
}

function fakeZone() {
    return {
        addEntity: sinon.mock(),
        removeEntity: sinon.mock(),
    };
}

function fakeWorld(zone = fakeZone()) {

    return {
        getZone: sinon.mock().callsFake((zoneId) => {
            return Promise.resolve(zone);
        }),
    }
}

function fakeNetworkLoop(): NetworkLoop {
    const loop = new NetworkLoop();
    loop.add = sinon.spy();
    return loop;
}

function fakeCommandStream() {
    return {
        sendCommand: sinon.spy(),
        onCommand: (command: string, data: string) => {
        },
    }
}

describe('ConnectionHandler', () => {

    it('should not forward command to state if not valid', function () {
        const commandStream = fakeCommandStream();
        new ConnectionHandler(new FakeUserDao(), fakeWorld(), fakeNetworkLoop(), commandStream);

        commandStream.onCommand('characters', '');
        sinon.assert.calledWith(commandStream.sendCommand, 'characters');

        assert.doesNotThrow(() => {
            commandStream.onCommand('no_such_command', '');
        });
    });

    it('should return characters', function () {
        const commandStream = fakeCommandStream();
        new ConnectionHandler(new FakeUserDao(), fakeWorld(), fakeNetworkLoop(), commandStream);

        commandStream.onCommand('characters', '');
        sinon.assert.calledWith(commandStream.sendCommand, 'characters', characters);
    });

    it('should return characters only once', function () {
        const commandStream = fakeCommandStream();
        new ConnectionHandler(new FakeUserDao(), fakeWorld(), fakeNetworkLoop(), commandStream);

        commandStream.onCommand('characters', '');
        commandStream.onCommand('characters', '');

        sinon.assert.calledOnce(commandStream.sendCommand);
    });

    it('should not create character on enter', async function () {
        const world = fakeWorld();

        const commandStream = fakeCommandStream();
        new ConnectionHandler(new FakeUserDao(), world, fakeNetworkLoop(), commandStream);

        commandStream.onCommand('characters', '');
        commandStream.onCommand('enter', '1');

        await tick();

        sinon.assert.notCalled(world.getZone);
    });

    it('should create character on ready', async function () {
        const zone = fakeZone();
        const world = fakeWorld(zone);
        const commandStream = fakeCommandStream();

        new ConnectionHandler(new FakeUserDao(), world, fakeNetworkLoop(), commandStream);

        commandStream.onCommand('characters', '');
        commandStream.onCommand('enter', '1');
        commandStream.onCommand('ready', '');

        await tick();

        sinon.assert.calledOnce(world.getZone);
        sinon.assert.calledOnce(zone.addEntity);
    });

    it('should respond to ready with ready', async function () {
        const commandStream = fakeCommandStream();
        new ConnectionHandler(new FakeUserDao(), fakeWorld(), fakeNetworkLoop(), commandStream);

        commandStream.onCommand('characters', '');
        commandStream.onCommand('enter', '1');
        commandStream.onCommand('ready', '');

        await tick();

        sinon.assert.calledWith(commandStream.sendCommand, 'ready', void 0);
    });


    it('should do anything only once when calling ready twice', async function () {
        const zone = fakeZone();
        const world = fakeWorld(zone);
        const commandStream = fakeCommandStream();

        new ConnectionHandler(new FakeUserDao(), world, fakeNetworkLoop(), commandStream);

        commandStream.onCommand('characters', '');
        commandStream.onCommand('enter', '1');
        commandStream.onCommand('ready', '');
        commandStream.onCommand('ready', '');

        await tick();

        sinon.assert.calledOnce(world.getZone);
    });

    it('should not call createObject when exit before zone load', async function () {
        const zone = fakeZone();
        const commandStream = fakeCommandStream();

        const dispatcher = new ConnectionHandler(new FakeUserDao(), fakeWorld(zone), fakeNetworkLoop(), commandStream);

        commandStream.onCommand('characters', '');
        commandStream.onCommand('enter', '1');
        commandStream.onCommand('ready', '');
        dispatcher.close();

        await tick();

        sinon.assert.notCalled(zone.addEntity);
    });

    it('should create character on ready only once', async function () {
        const zone = fakeZone();
        const commandStream = fakeCommandStream();

        new ConnectionHandler(new FakeUserDao(), fakeWorld(zone), fakeNetworkLoop(), commandStream);

        commandStream.onCommand('characters', '');
        commandStream.onCommand('enter', '1');
        commandStream.onCommand('ready', '');
        commandStream.onCommand('ready', '');

        await tick();

        sinon.assert.calledOnce(zone.addEntity);
    });

    it('should do nothing when entering incorrect character id', async function () {
        const zone = fakeZone();
        const world = fakeWorld(zone);
        const commandStream = fakeCommandStream();

        new ConnectionHandler(new FakeUserDao(), world, fakeNetworkLoop(), commandStream);

        commandStream.onCommand('characters', '');
        commandStream.onCommand('enter', '0');
        commandStream.onCommand('ready', '');

        await tick();

        sinon.assert.notCalled(world.getZone);
        sinon.assert.notCalled(zone.addEntity);
    });

    it('should remove character on leave', async function () {
        const zone = fakeZone();
        const world = fakeWorld(zone);
        const commandStream = fakeCommandStream();

        new ConnectionHandler(new FakeUserDao(), world, fakeNetworkLoop(), commandStream);

        commandStream.onCommand('characters', '');
        commandStream.onCommand('enter', '1');
        commandStream.onCommand('ready', '');

        await tick();

        commandStream.onCommand('leave', '');

        sinon.assert.calledOnce(zone.removeEntity);
    });

    it('should remove character on exit', async function () {
        const zone = fakeZone();
        const world = fakeWorld(zone);
        const commandStream = fakeCommandStream();

        const dispatcher = new ConnectionHandler(new FakeUserDao(), world, fakeNetworkLoop(), commandStream);

        commandStream.onCommand('characters', '');
        commandStream.onCommand('enter', '1');
        commandStream.onCommand('ready', '');

        await tick();

        dispatcher.close();

        sinon.assert.calledOnce(zone.removeEntity);
    });

    it('should accept characters request after leave', async function () {
        const world = fakeWorld();
        const commandStream = fakeCommandStream();

        const dispatcher = new ConnectionHandler(new FakeUserDao(), world, fakeNetworkLoop(), commandStream);

        commandStream.onCommand('characters', '');
        commandStream.onCommand('enter', '1');
        commandStream.onCommand('ready', '');

        await tick();

        commandStream.onCommand('leave', '');
        commandStream.onCommand('characters', '');

        sinon.assert.calledThrice(commandStream.sendCommand); // characters, ready, characters
    });
});