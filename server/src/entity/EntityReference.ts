import { Entity } from './Entity';

export type ReferenceReason = 'interacting';

export class EntityReference {
    private entity: Entity | undefined = void 0;

    constructor(readonly reason: ReferenceReason) {
    }

    get(): Entity | undefined {
        return this.entity;
    }

    set(entity: Entity) {
        this.dereferenceIfHas();
        this.entity = entity;
        entity.referenced(this);
    }

    unset() {
        this.dereferenceIfHas();
        this.entity = void 0;
    }

    private dereferenceIfHas() {
        if (this.entity) {
            this.entity.dereferenced(this);
        }
    }
}
