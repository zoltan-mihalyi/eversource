import { WorldImpl } from '../src/world/World';
import * as sinon from 'sinon';
import { ZoneId } from '../../common/domain/Location';
import { GridLoader } from '../src/world/GridLoader';

const zoneId = 'zone' as ZoneId;

function gridLoaderLoad(zoneId: ZoneId, callback: (err: any, grid?: any) => void) {
    callback(null, {});
}

function createGridLoader(load = gridLoaderLoad) {
    return {
        load: sinon.mock().callsFake(load),
    };
}

const runningWorlds = new Set<WorldImpl>();

function newWorld(gridLoader: GridLoader) {
    const world = new WorldImpl(gridLoader);
    runningWorlds.add(world);
    return world;
}

describe('World', function () {
    afterEach(function () {
        runningWorlds.forEach(world => world.stop());
        runningWorlds.clear();
    });

    it('should load zone and call callback', function () {

        const gridLoader = createGridLoader();
        const world = newWorld(gridLoader);
        const callback = sinon.spy();

        world.getZone(zoneId, callback);

        sinon.assert.calledOnce(gridLoader.load);
        sinon.assert.calledOnce(callback);
    });

    it('should call getZone callbacks added during loading', function () {

        const load = sinon.spy();
        const gridLoader = createGridLoader(load);
        const world = newWorld(gridLoader);
        const callback = sinon.mock();
        const callback2 = sinon.mock();

        world.getZone(zoneId, callback);
        world.getZone(zoneId, callback2);
        load.getCall(0).args[1](null, {});

        sinon.assert.calledOnce(callback);
        sinon.assert.calledOnce(callback2);
    });
});