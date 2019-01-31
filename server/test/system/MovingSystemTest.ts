import * as assert from 'assert';
import { Grid, GridBlock } from '../../../common/Grid';
import { tryMove } from '../../src/es/MovingSystem';
import { position } from '../sampleData';

const X = GridBlock.FULL;
const _ = GridBlock.EMPTY;
const A = GridBlock.TOP_LEFT;
const B = GridBlock.TOP_RIGHT;
const C = GridBlock.BOTTOM_LEFT;
const D = GridBlock.BOTTOM_RIGHT;

const gridX = new Grid(4, 4, [
    _, B, A, _,
    C, _, _, D,
    A, _, _, B,
    _, D, C, _,
]);

const gridDiag1 = new Grid(4, 4, [
    _, _, _, _,
    C, _, _, _,
    _, C, _, _,
    _, _, C, _,
]);

const gridRect = new Grid(4, 4, [
    X, X, X, X,
    X, _, _, X,
    X, _, _, X,
    X, X, X, X,
]);


describe('MovingSystem', function () {
    it('tryMove X right', function () {
        const { x, y } = tryMove(gridX, position(2, 2), 1, 2, 0);
        assert.strictEqual(x, 2.5);
        assert.strictEqual(y, 2);
    });

    it('tryMove X left', function () {
        const { x, y } = tryMove(gridX, position(2, 2), 1, -2, 0);
        assert.strictEqual(x, 1.5);
        assert.strictEqual(y, 2);
    });

    it('tryMove X up', function () {
        const { x, y } = tryMove(gridX, position(2, 2), 1, -0, -2);
        assert.strictEqual(x, 2);
        assert.strictEqual(y, 1.5);
    });

    it('tryMove X down', function () {
        const { x, y } = tryMove(gridX, position(2, 2), 1, 0, 2);
        assert.strictEqual(x, 2);
        assert.strictEqual(y, 2.5);
    });

    it('tryMove Rect down', function () {
        const { x, y } = tryMove(gridRect, position(2, 2), 1, 0, 2);
        assert.strictEqual(x, 2);
        assert.strictEqual(y, 2.5);
    });

    it('tryMove Diag1 left', function () {
        const { x, y } = tryMove(gridDiag1, position(3, 2), 1, -2, 0);
        assert.strictEqual(x, 2);
        assert.strictEqual(y, 2);
    });

    it('tryMove Diag1 left2', function () {
        const { x, y } = tryMove(gridDiag1, position(3, 2.5), 1, -2, 0);
        assert.strictEqual(x, 2.5);
        assert.strictEqual(y, 2.5);
    });
});