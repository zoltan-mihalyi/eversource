import { Entity } from '../src/entity/Entity';
import { BASE_MONSTER, CreatureEntity } from '../src/entity/CreatureEntity';
import { X, Y } from '../../common/domain/Location';
import { Grid, GridBlock } from '../../common/Grid';
import * as assert from 'assert';
import { EntityOwner } from '../src/entity/EntityOwner';

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


describe('Entity', function () {
    it('tryMove X right', function () {
        const e = entity(2, 2);
        e.tryMove(gridX, 2, 0);

        const { x, y } = e.get().position;
        assert.strictEqual(x, 2.5);
        assert.strictEqual(y, 2);
    });

    it('tryMove X left', function () {
        const e = entity(2, 2);
        e.tryMove(gridX, -2, 0);

        const { x, y } = e.get().position;
        assert.strictEqual(x, 1.5);
        assert.strictEqual(y, 2);
    });

    it('tryMove X up', function () {
        const e = entity(2, 2);
        e.tryMove(gridX, 0, -2);

        const { x, y } = e.get().position;
        assert.strictEqual(x, 2);
        assert.strictEqual(y, 1.5);
    });

    it('tryMove X down', function () {
        const e = entity(2, 2);
        e.tryMove(gridX, 0, 2);

        const { x, y } = e.get().position;
        assert.strictEqual(x, 2);
        assert.strictEqual(y, 2.5);
    });

    it('tryMove Rect down', function () {
        const e = entity(2, 2);
        e.tryMove(gridRect, 0, 2);

        const { x, y } = e.get().position;
        assert.strictEqual(x, 2);
        assert.strictEqual(y, 2.5);
    });

    it('tryMove Diag1 left', function () {
        const e = entity(3, 2);
        e.tryMove(gridDiag1, -2, 0);

        const { x, y } = e.get().position;
        assert.strictEqual(x, 2);
        assert.strictEqual(y, 2);
    });

    it('tryMove Diag1 left2', function () {
        const e = entity(3, 2.5);
        e.tryMove(gridDiag1, -2, 0);

        const { x, y } = e.get().position;
        assert.strictEqual(x, 2.5);
        assert.strictEqual(y, 2.5);
    });
});

const owner = new EntityOwner();

function entity(x: number, y: number): Entity {
    return new CreatureEntity(owner, {
        ...BASE_MONSTER,
        image: '',
        level: 1,
        scale: 1,
        position: {
            x: x as X,
            y: y as Y,
        },
        name: '',
    }, { name: '', questCompletions: [], quests: [] });
}
