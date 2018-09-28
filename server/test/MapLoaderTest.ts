import { TmxMapLoader } from '../src/world/MapLoader';
import { ZoneId } from '../../common/domain/Location';
import * as assert from 'assert';

const X = true;
const _ = false;

describe('MapLoader', function () {
    it('should calculate hasBlock properly', async function () {

        const mapLoader = new TmxMapLoader('./map');

        const grid = (await mapLoader.load('test' as ZoneId)).grid;

        [X, X, X, X, X, X, _, X, X, X, _, _, X, X, X, X, X, _, _, _].forEach((block, x) => {
            assert(grid.hasBlock(x, 0) === block, `${x}, 0, ${block}`);
            assert(grid.hasBlock(x, 1) === block, `${x}, 1, ${block}`);
        });
    });

});