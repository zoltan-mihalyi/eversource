import { TmxMapLoader } from '../src/world/MapLoader';
import { ZoneId } from '../../common/domain/Location';
import * as assert from 'assert';
import { GridBlock } from '../../common/Grid';

const X = GridBlock.FULL;
const _ = GridBlock.EMPTY;
const A = GridBlock.TOP_LEFT;
const B = GridBlock.TOP_RIGHT;
const C = GridBlock.BOTTOM_LEFT;
const D = GridBlock.BOTTOM_RIGHT;

describe('MapLoader', function () {
    it('should calculate getBlock properly', async function () {

        const mapLoader = new TmxMapLoader('./map');

        const grid = (await mapLoader.load('test' as ZoneId)).grid;

        const expected = [
            [D, X, C, D, X, C, _, D, X, C, _, _, D, X, X, X, C, _, X, _],
            [X, X, X, X, X, X, _, X, X, X, _, _, X, X, X, X, X, _, X, _],
            [B, X, A, B, X, A, _, B, X, A, _, _, B, X, X, X, A, _, _, _],
        ];

        expected.forEach((row, y) => row.forEach((block, x) => {
            assert.strictEqual(grid.getBlock(x, y), block, `${x}, ${y}, ${block}`);
        }));
    });

});