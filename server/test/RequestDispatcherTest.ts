import { RequestDispatcher } from '../src/protocol/RequestDispatcher';
import { CharacterId, CharacterInfo, CharacterName, ClassId } from '../../common/domain/CharacterInfo';
import { X, Y, ZoneId } from '../../common/domain/Location';
import { UserDao } from '../src/dao/UserDao';
import * as sinon from 'sinon';
import * as assert from 'assert';
import { NetworkLoop } from '../src/NetworkLoop';

const characters: CharacterInfo[] = [
    {
        name: 'John' as CharacterName,
        id: '1' as CharacterId,
        classId: 'warrior' as ClassId,

        location: {
            x: 100 as X,
            y: 100 as Y,
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

describe('RequestDispatcher', () => {

    it('is valid command', function () {
        const dispatcher = new RequestDispatcher(new FakeUserDao(), fakeWorld(), sinon.fake(), fakeNetworkLoop());

        assert(dispatcher.isValidCommand('characters'));
        assert(!dispatcher.isValidCommand('no_such_command'));
    });

    it('should return characters', function () {
        const send = sinon.fake();

        const dispatcher = new RequestDispatcher(new FakeUserDao(), fakeWorld(), send, fakeNetworkLoop());

        dispatcher.handleRequest('characters', void 0);

        sinon.assert.calledWith(send, 'characters', characters);
    });

    it('should return characters only once', function () {
        const send = sinon.fake();

        const dispatcher = new RequestDispatcher(new FakeUserDao(), fakeWorld(), send, fakeNetworkLoop());

        dispatcher.handleRequest('characters', void 0);
        dispatcher.handleRequest('characters', void 0);

        sinon.assert.calledOnce(send);
    });

    it('should not create character on enter', function () {
        const world = fakeWorld();

        const dispatcher = new RequestDispatcher(new FakeUserDao(), world, sinon.fake(), fakeNetworkLoop());

        dispatcher.handleRequest('characters', void 0);
        dispatcher.handleRequest('enter', '1');

        sinon.assert.notCalled(world.getZone);
    });

    it('should create character on ready', function () {
        const zone = fakeZone();
        const world = fakeWorld(zone);

        const dispatcher = new RequestDispatcher(new FakeUserDao(), world, sinon.fake(), fakeNetworkLoop());

        dispatcher.handleRequest('characters', void 0);
        dispatcher.handleRequest('enter', '1');
        dispatcher.handleRequest('ready', void 0);

        sinon.assert.calledOnce(world.getZone);
        sinon.assert.calledOnce(zone.addObject);
    });

    it('should respond to ready with ready', function () {
        const send = sinon.fake();

        const dispatcher = new RequestDispatcher(new FakeUserDao(), fakeWorld(), send, fakeNetworkLoop());

        dispatcher.handleRequest('characters', void 0);
        dispatcher.handleRequest('enter', '1');
        dispatcher.handleRequest('ready', void 0);

        sinon.assert.calledWith(send, 'ready', void 0);
    });


    it('should do nothing when calling ready twice before server ready', function () {
        const zone = fakeZone();
        const world = fakeWorld(zone, true);

        const dispatcher = new RequestDispatcher(new FakeUserDao(), world, sinon.fake(), fakeNetworkLoop());

        dispatcher.handleRequest('characters', void 0);
        dispatcher.handleRequest('enter', '1');
        dispatcher.handleRequest('ready', void 0);
        dispatcher.handleRequest('ready', void 0);

        sinon.assert.calledOnce(world.getZone);
    });

    it('should not call createObject when exit before zone load', function () {
        const zone = fakeZone();

        const world = {
            getZone: sinon.spy(),
        };

        const dispatcher = new RequestDispatcher(new FakeUserDao(), world, sinon.fake(), fakeNetworkLoop());

        dispatcher.handleRequest('characters', void 0);
        dispatcher.handleRequest('enter', '1');
        dispatcher.handleRequest('ready', void 0);
        dispatcher.handleExit();

        world.getZone.getCall(0).args[1](zone);

        sinon.assert.notCalled(zone.addObject);
    });

    it('should create character on ready only once', function () {
        const zone = fakeZone();
        const world = fakeWorld(zone);

        const dispatcher = new RequestDispatcher(new FakeUserDao(), world, sinon.fake(), fakeNetworkLoop());

        dispatcher.handleRequest('characters', void 0);
        dispatcher.handleRequest('enter', '1');
        dispatcher.handleRequest('ready', void 0);
        dispatcher.handleRequest('ready', void 0);

        sinon.assert.calledOnce(zone.addObject);
    });

    it('should do nothing when entering incorrect character id', function () {
        const zone = fakeZone();
        const world = fakeWorld(zone);

        const dispatcher = new RequestDispatcher(new FakeUserDao(), world, sinon.fake(), fakeNetworkLoop());

        dispatcher.handleRequest('characters', void 0);
        dispatcher.handleRequest('enter', '0');
        dispatcher.handleRequest('ready', void 0);

        sinon.assert.notCalled(zone.addObject);
    });

    it('should remove character on leave', function () {
        const zone = fakeZone();
        const world = fakeWorld(zone);

        const dispatcher = new RequestDispatcher(new FakeUserDao(), world, sinon.fake(), fakeNetworkLoop());

        dispatcher.handleRequest('characters', void 0);
        dispatcher.handleRequest('enter', '1');
        dispatcher.handleRequest('ready', void 0);
        dispatcher.handleRequest('leave', void 0);

        sinon.assert.calledOnce(zone.removeObject);
    });

    it('should remove character on exit', function () {
        const zone = fakeZone();
        const world = fakeWorld(zone);

        const dispatcher = new RequestDispatcher(new FakeUserDao(), world, sinon.fake(), fakeNetworkLoop());

        dispatcher.handleRequest('characters', void 0);
        dispatcher.handleRequest('enter', '1');
        dispatcher.handleRequest('ready', void 0);
        dispatcher.handleExit();

        sinon.assert.calledOnce(zone.removeObject);
    });

    it('should accept characters request after leave', function () {
        const send = sinon.fake();
        const world = fakeWorld();

        const dispatcher = new RequestDispatcher(new FakeUserDao(), world, send, fakeNetworkLoop());

        dispatcher.handleRequest('characters', void 0);
        dispatcher.handleRequest('enter', '1');
        dispatcher.handleRequest('ready', void 0);
        dispatcher.handleRequest('leave', void 0);
        dispatcher.handleRequest('characters', void 0);

        sinon.assert.calledThrice(send); // characters, ready, characters
    });
});