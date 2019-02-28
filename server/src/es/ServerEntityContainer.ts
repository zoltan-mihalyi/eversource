import { ServerComponents } from './ServerComponents';
import { EntityContainer } from '../../../common/es/EntityContainer';
import { Entity, EntityId } from '../../../common/es/Entity';

let nextId = 0;

export class ServerEntityContainer extends EntityContainer<ServerComponents>{
    createEntity(template?: Partial<ServerComponents>): Entity<ServerComponents> {
        return this.createEntityWithId(nextId++ as EntityId, template);
    }
}
