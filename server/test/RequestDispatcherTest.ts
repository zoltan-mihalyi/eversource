import { RequestDispatcher } from '../src/protocol/RequestDispatcher';
import { CharacterId, CharacterInfo, ClassId } from '../../common/domain/CharacterInfo';
import { X, Y, ZoneId } from '../../common/domain/Location';
import { UserDao } from '../src/dao/UserDao';
import * as sinon from 'sinon';
import * as assert from 'assert';

const characters: CharacterInfo[] = [
    {
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

function fakeWorld() {
    return {
        createObject: sinon.spy(),
        removeObject: sinon.spy(),
    }
}

describe('RequestDispatcher', () => {

    it('is valid command', function () {
        const dispatcher = new RequestDispatcher(new FakeUserDao(), fakeWorld(), sinon.fake());

        assert(dispatcher.isValidCommand('characters'));
        assert(!dispatcher.isValidCommand('no_such_command'));
    });

    it('should return characters', function () {
        const send = sinon.fake();

        const dispatcher = new RequestDispatcher(new FakeUserDao(), fakeWorld(), send);

        dispatcher.handleRequest('characters', void 0);

        sinon.assert.calledWith(send, 'characters', characters);
    });

    it('should return characters only once', function () {
        const send = sinon.fake();

        const dispatcher = new RequestDispatcher(new FakeUserDao(), fakeWorld(), send);

        dispatcher.handleRequest('characters', void 0);
        dispatcher.handleRequest('characters', void 0);

        sinon.assert.calledOnce(send);
    });

    it('should not create character on enter', function () {
        const world = fakeWorld();

        const dispatcher = new RequestDispatcher(new FakeUserDao(), world, sinon.fake());

        dispatcher.handleRequest('characters', void 0);
        dispatcher.handleRequest('enter', '1');

        sinon.assert.notCalled(world.createObject);
    });

    it('should create character on ready', function () {
        const world = fakeWorld();

        const dispatcher = new RequestDispatcher(new FakeUserDao(), world, sinon.fake());

        dispatcher.handleRequest('characters', void 0);
        dispatcher.handleRequest('enter', '1');
        dispatcher.handleRequest('ready', void 0);

        sinon.assert.calledOnce(world.createObject);
    });

    it('should create character on ready only once', function () {
        const world = fakeWorld();

        const dispatcher = new RequestDispatcher(new FakeUserDao(), world, sinon.fake());

        dispatcher.handleRequest('characters', void 0);
        dispatcher.handleRequest('enter', '1');
        dispatcher.handleRequest('ready', void 0);
        dispatcher.handleRequest('ready', void 0);

        sinon.assert.calledOnce(world.createObject);
    });

    it('should do nothing when entering incorrect character id', function () {
        const world = fakeWorld();

        const dispatcher = new RequestDispatcher(new FakeUserDao(), world, sinon.fake());

        dispatcher.handleRequest('characters', void 0);
        dispatcher.handleRequest('enter', '0');
        dispatcher.handleRequest('ready', void 0);

        sinon.assert.notCalled(world.createObject);
    });

    it('should remove character on leave', function () {
        const world = fakeWorld();

        const dispatcher = new RequestDispatcher(new FakeUserDao(), world, sinon.fake());

        dispatcher.handleRequest('characters', void 0);
        dispatcher.handleRequest('enter', '1');
        dispatcher.handleRequest('ready', void 0);
        dispatcher.handleRequest('leave', void 0);

        sinon.assert.calledOnce(world.removeObject);
    });

    it('should remove character on exit', function () {
        const world = fakeWorld();

        const dispatcher = new RequestDispatcher(new FakeUserDao(), world, sinon.fake());

        dispatcher.handleRequest('characters', void 0);
        dispatcher.handleRequest('enter', '1');
        dispatcher.handleRequest('ready', void 0);
        dispatcher.handleExit();

        sinon.assert.calledOnce(world.removeObject);
    });

    it('should accept characters request after leave', function () {
        const send = sinon.fake();
        const world = fakeWorld();

        const dispatcher = new RequestDispatcher(new FakeUserDao(), world, send);

        dispatcher.handleRequest('characters', void 0);
        dispatcher.handleRequest('enter', '1');
        dispatcher.handleRequest('ready', void 0);
        dispatcher.handleRequest('leave', void 0);
        dispatcher.handleRequest('characters', void 0);

        sinon.assert.calledTwice(send);
    });
});