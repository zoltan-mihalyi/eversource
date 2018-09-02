import { WorldImpl } from '../src/world/World';
import * as sinon from 'sinon';
import { Location, X, Y, ZoneId } from '../../common/domain/Location';

const location: Location = {
    zoneId: 'zone' as ZoneId,
    x: 1 as X,
    y: 2 as Y,
};

function gridLoaderLoad(zoneId: ZoneId, callback: (err: any, grid?: any) => void) {
    callback(null, {});
}

function createGridLoader(load = gridLoaderLoad) {
    return {
        load: sinon.mock().callsFake(load),
    };
}

describe('World', function () {
    it('should load location of createObject and call callback', function () {

        const gridLoader = createGridLoader();
        const world = new WorldImpl(gridLoader);
        const callback = sinon.spy();

        world.createObject(location, { cancelled: false }, callback);

        sinon.assert.calledOnce(gridLoader.load);
        sinon.assert.calledOnce(callback);
    });

    it('should not call createObject callback if cancelled', function () {

        const load = sinon.spy();
        const gridLoader = createGridLoader(load);
        const world = new WorldImpl(gridLoader);
        const token = { cancelled: false };
        const callback = sinon.mock();

        world.createObject(location, token, callback);
        token.cancelled = true;
        load.getCall(0).args[1](null, {});

        sinon.assert.notCalled(callback);
    });

    it('should call createObject callbacks added during loading', function () {

        const load = sinon.spy();
        const gridLoader = createGridLoader(load);
        const world = new WorldImpl(gridLoader);
        const callback = sinon.mock();
        const callback2 = sinon.mock();

        world.createObject(location, { cancelled: false }, callback);
        world.createObject(location, { cancelled: false }, callback2);
        load.getCall(0).args[1](null, {});

        sinon.assert.calledOnce(callback);
        sinon.assert.calledOnce(callback2);
    });
});