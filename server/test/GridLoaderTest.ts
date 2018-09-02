import { TmxGridLoader } from '../src/world/GridLoader';
import { ZoneId } from '../../common/domain/Location';
import { Grid } from '../src/world/Grid';
import * as assert from 'assert';

const X = true;
const _ = false;

describe('GridLoader', function () {
    it('should calculate hasBlock properly', async function () {

        const tmxGridLoader = new TmxGridLoader('./map');

        const grid = await new Promise<Grid>((resolve, reject) => {
            tmxGridLoader.load('test' as ZoneId, (err: any, grid?: Grid) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(grid)
                }
            });
        });

        [X, X, X, X, X, X, _, X, X, X, _, _, X, X, X, X, X, _, _, _].forEach((block, x) => {
            assert(grid.hasBlock(x, 0) === block, `${x}, 0, ${block}`);
            assert(grid.hasBlock(x, 1) === block, `${x}, 1, ${block}`);
        });
    });

});