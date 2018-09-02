import { Grid } from '../src/world/Grid';
import * as assert from 'assert';

const X = true;
const _ = false;
const grid = new Grid(5, 3, [
    X, _, _, X, _,
    _, _, _, _, _,
    X, X, X, _, _,
]);

describe('Grid', function () {
    it('should calculate hasBlock properly', function () {


        assert(grid.hasBlock(0,0));
        assert(!grid.hasBlock(1,0));
        assert(grid.hasBlock(2,2));
        assert(!grid.hasBlock(2,3));

    });

});