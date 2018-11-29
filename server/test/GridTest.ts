import { Grid, GridBlock } from '../../common/Grid';
import * as assert from 'assert';

const X = GridBlock.FULL;
const _ = GridBlock.EMPTY;
const grid = new Grid(5, 3, [
    X, _, _, X, _,
    _, _, _, _, _,
    X, X, X, _, _,
]);

describe('Grid', function () {
    it('should calculate hasBlock properly', function () {


        assert.strictEqual(grid.getBlock(0,0), X);
        assert.strictEqual(grid.getBlock(1,0), _);
        assert.strictEqual(grid.getBlock(2,2), X);
        assert.strictEqual(grid.getBlock(2,3), _);

    });

});