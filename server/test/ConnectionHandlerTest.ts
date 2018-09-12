import { ConnectionHandler } from '../src/protocol/ConnectionHandler';
import { CharacterId, CharacterInfo, CharacterName, ClassId } from '../../common/domain/CharacterInfo';
import { X, Y, ZoneId } from '../../common/domain/Location';
import { UserDao } from '../src/dao/UserDao';
import * as sinon from 'sinon';
import * as assert from 'assert';
import { NetworkLoop } from '../src/NetworkLoop';
import { CommandStream } from '../src/protocol/CommandStream';

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
    },
];

class FakeUserDao implements UserDao {
    getCharacters(): CharacterInfo[] {
        return characters;
    }

    getCharacterIfExists(id: string): CharacterInfo | null {
        if (id !== '1') {
            return null;
        }
        return characters[0];
    }
}

function fakeZone() {
    return {
        addObject: sinon.mock(),
        removeObject: sinon.mock(),
    };
}

function fakeWorld(zone = fakeZone(), async?: boolean) {

    return {
        getZone: sinon.mock().callsFake((zoneId, callback) => {
            if (async) {
                setTimeout(() => callback(zone), 10);
            } else {
                callback(zone);
            }
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
        }
    }
}

describe('RequestDispatcher', () => {

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

    it('should not create character on enter', function () {
        const world = fakeWorld();

        const commandStream = fakeCommandStream();
        new ConnectionHandler(new FakeUserDao(), world, fakeNetworkLoop(), commandStream);

        commandStream.onCommand('characters', '');
        commandStream.onCommand('enter', '1');

        sinon.assert.notCalled(world.getZone);
    });

    it('should create character on ready', function () {
        const zone = fakeZone();
        const world = fakeWorld(zone);
        const commandStream = fakeCommandStream();

        new ConnectionHandler(new FakeUserDao(), world, fakeNetworkLoop(), commandStream);

        commandStream.onCommand('characters', '');
        commandStream.onCommand('enter', '1');
        commandStream.onCommand('ready', '');

        sinon.assert.calledOnce(world.getZone);
        sinon.assert.calledOnce(zone.addObject);
    });

    it('should respond to ready with ready', function () {
        const commandStream = fakeCommandStream();
        new ConnectionHandler(new FakeUserDao(), fakeWorld(), fakeNetworkLoop(), commandStream);

        commandStream.onCommand('characters', '');
        commandStream.onCommand('enter', '1');
        commandStream.onCommand('ready', '');

        sinon.assert.calledWith(commandStream.sendCommand, 'ready', void 0);
    });


    it('should do nothing when calling ready twice before server ready', function () {
        const zone = fakeZone();
        const world = fakeWorld(zone, true);
        const commandStream = fakeCommandStream();

        new ConnectionHandler(new FakeUserDao(), world, fakeNetworkLoop(), commandStream);

        commandStream.onCommand('characters', '');
        commandStream.onCommand('enter', '1');
        commandStream.onCommand('ready', '');
        commandStream.onCommand('ready', '');

        sinon.assert.calledOnce(world.getZone);
    });

    it('should not call createObject when exit before zone load', function () {
        const zone = fakeZone();
        const commandStream = fakeCommandStream();

        const world = {
            getZone: sinon.spy(),
        };

        const dispatcher = new ConnectionHandler(new FakeUserDao(), world, fakeNetworkLoop(), commandStream);

        commandStream.onCommand('characters', '');
        commandStream.onCommand('enter', '1');
        commandStream.onCommand('ready', '');
        dispatcher.close();

        world.getZone.getCall(0).args[1](zone);

        sinon.assert.notCalled(zone.addObject);
    });

    it('should create character on ready only once', function () {
        const zone = fakeZone();
        const world = fakeWorld(zone);
        const commandStream = fakeCommandStream();

        new ConnectionHandler(new FakeUserDao(), world, fakeNetworkLoop(), commandStream);

        commandStream.onCommand('characters', '');
        commandStream.onCommand('enter', '1');
        commandStream.onCommand('ready', '');
        commandStream.onCommand('ready', '');

        sinon.assert.calledOnce(zone.addObject);
    });

    it('should do nothing when entering incorrect character id', function () {
        const zone = fakeZone();
        const world = fakeWorld(zone);
        const commandStream = fakeCommandStream();

        new ConnectionHandler(new FakeUserDao(), world, fakeNetworkLoop(), commandStream);

        commandStream.onCommand('characters', '');
        commandStream.onCommand('enter', '0');
        commandStream.onCommand('ready', '');

        sinon.assert.notCalled(zone.addObject);
    });

    it('should remove character on leave', function () {
        const zone = fakeZone();
        const world = fakeWorld(zone);
        const commandStream = fakeCommandStream();

        new ConnectionHandler(new FakeUserDao(), world, fakeNetworkLoop(), commandStream);

        commandStream.onCommand('characters', '');
        commandStream.onCommand('enter', '1');
        commandStream.onCommand('ready', '');
        commandStream.onCommand('leave', '');

        sinon.assert.calledOnce(zone.removeObject);
    });

    it('should remove character on exit', function () {
        const zone = fakeZone();
        const world = fakeWorld(zone);
        const commandStream = fakeCommandStream();

        const dispatcher = new ConnectionHandler(new FakeUserDao(), world, fakeNetworkLoop(), commandStream);

        commandStream.onCommand('characters', '');
        commandStream.onCommand('enter', '1');
        commandStream.onCommand('ready', '');
        dispatcher.close();

        sinon.assert.calledOnce(zone.removeObject);
    });

    it('should accept characters request after leave', function () {
        const world = fakeWorld();
        const commandStream = fakeCommandStream();

        const dispatcher = new ConnectionHandler(new FakeUserDao(), world, fakeNetworkLoop(), commandStream);

        commandStream.onCommand('characters', '');
        commandStream.onCommand('enter', '1');
        commandStream.onCommand('ready', '');
        commandStream.onCommand('leave', '');
        commandStream.onCommand('characters', '');

        sinon.assert.calledThrice(commandStream.sendCommand); // characters, ready, characters
    });
});