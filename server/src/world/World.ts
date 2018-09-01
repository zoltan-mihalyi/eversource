export interface WorldObject {
    world: World;
}

export class World {
    createObject(): WorldObject {
        return {
            world: this,
        };
    }

    removeObject(object: WorldObject) {
    }
}