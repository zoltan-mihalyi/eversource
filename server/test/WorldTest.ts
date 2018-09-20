import { WorldImpl } from '../src/world/World';
import * as sinon from 'sinon';
import * as assert from 'assert';
import { ZoneId } from '../../common/domain/Location';
import { GridLoader } from '../src/world/GridLoader';
import { Grid } from '../../common/Grid';

const zoneId = 'zone' as ZoneId;

function gridLoaderLoad(): Promise<Grid> {
    return Promise.resolve({} as Grid);
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

    it('should load and return zone', async function () {

        const gridLoader = createGridLoader();
        const world = newWorld(gridLoader);

        const zone = await world.getZone(zoneId);

        assert(zone != null);

        sinon.assert.calledOnce(gridLoader.load);
    });

    it('should resolve parallel getZone calls but call gridLoader.load only once', async function () {
        const gridLoader = createGridLoader();
        const world = newWorld(gridLoader);

        const zones = await Promise.all([world.getZone(zoneId), world.getZone(zoneId)]);

        assert(zones[0] === zones[1]);

        sinon.assert.calledOnce(gridLoader.load);
    });
});