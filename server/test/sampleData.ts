import { Entity } from '../src/entity/Entity';
import { BASE_MONSTER, CreatureEntity } from '../src/entity/CreatureEntity';
import { X, Y } from '../../common/domain/Location';
import { EntityOwner } from '../src/entity/EntityOwner';
import { Zone } from '../src/world/Zone';
import { Grid } from '../../common/Grid';

const defaultOwner = createOwner();

export function createZone() {
    return new Zone(new Grid(0, 0, []));
}

export function createOwner() {

    return new EntityOwner(createZone());
}

export function entity(x: number, y: number, owner = defaultOwner): Entity {
    return new CreatureEntity(owner, {
        ...BASE_MONSTER,
        image: '',
        level: 1,
        hp: 100,
        maxHp: 100,
        scale: 1,
        position: {
            x: x as X,
            y: y as Y,
        },
        name: '',
    }, { name: '', story: '', questCompletions: [], quests: [] });
}
