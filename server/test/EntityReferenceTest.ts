import { EntityReference } from '../src/entity/EntityReference';
import * as assert from 'assert';
import { createOwner, createZone, entity } from './sampleData';
import { PlayerEntityOwner } from '../src/entity/EntityOwner';

describe('EntityReferenceTest', function () {
    it('Empty when created', () => {
        const ref = new EntityReference('interacting');

        assert.strictEqual(ref.get(), void 0);
    });

    it('Owner is not referenced by default', () => {
        const owner = createOwner();

        assert.strictEqual(owner.isReferenced('interacting'), false);
    });

    it('Can get what is added', () => {
        const ref = new EntityReference('interacting');
        const e = entity(0, 0);
        ref.set(e);

        assert.strictEqual(ref.get(), e);
    });

    it('Owner is referenced after ref.set()', () => {
        const owner = createOwner();
        const ref = new EntityReference('interacting');
        ref.set(entity(0, 0, owner));

        assert.strictEqual(owner.isReferenced('interacting'), true);
    });

    it('Previous owner is dereferenced after ref.set()', () => {
        const owner1 = createOwner();
        const owner2 = createOwner();
        const ref = new EntityReference('interacting');
        ref.set(entity(0, 0, owner1));
        ref.set(entity(0, 0, owner2));

        assert.strictEqual(owner1.isReferenced('interacting'), false);
    });

    it('Owner is dereferenced after ref.unset()', () => {
        const owner = createOwner();
        const ref = new EntityReference('interacting');
        ref.set(entity(0, 0, owner));
        ref.unset();

        assert.strictEqual(owner.isReferenced('interacting'), false);
    });

    it('Removing interacting entity causes ref.unset()', () => {
        const ref = new EntityReference('interacting');
        const owner = createOwner();
        const e = entity(0, 0, owner);
        ref.set(e);
        (owner as any).entity = e;
        owner.removeEntity();

        assert.strictEqual(owner.isReferenced('interacting'), false);
        assert.strictEqual(ref.get(), void 0);
    });

    it('Removing player causes interacting owner to be dereferenced.', () => {
        const player = new PlayerEntityOwner(createZone(), {} as any);
        const playerEntity = entity(0, 0, player);
        player.setEntity(playerEntity as any);

        const entityOwner = createOwner();
        const e = entity(0, 0, entityOwner);
        player.interactingRef.set(e);

        player.removeEntity();

        assert.strictEqual(entityOwner.isReferenced('interacting'), false);
    });
});
