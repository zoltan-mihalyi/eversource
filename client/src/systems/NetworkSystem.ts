import { EntityContainer } from '../../../common/es/EntityContainer';
import { ClientComponents } from '../es/ClientComponents';
import { EventBus } from '../../../common/es/EventBus';
import { ClientEvents } from '../es/ClientEvents';
import { NetworkComponents } from '../../../common/components/NetworkComponents';
import { PlayingNetworkApi } from '../protocol/PlayingState';

export function networkSystem(playingNetworkApi: PlayingNetworkApi,
                              container: EntityContainer<ClientComponents>, eventBus: EventBus<ClientEvents>) {

    eventBus.on('interact', (entityId) => playingNetworkApi.interact(entityId));

    eventBus.on('worldUpdate', (diffs) => {
        for (const diff of diffs) {
            const id = diff.id;
            switch (diff.type) {
                case 'create': {
                    container.createEntityWithId(diff.id, diff.data as Partial<NetworkComponents>);
                    break;
                }
                case 'change': {
                    const entity = container.getEntity(id);
                    if (!entity) {
                        console.error(`[CHANGE] Unknown entity id: ${id}`);
                        break;
                    }

                    for (const key of Object.keys(diff.changes) as (keyof NetworkComponents)[]) {
                        const value = diff.changes[key];
                        if (!value) {
                            entity.unset(key);
                        } else {
                            entity.set(key, value);
                        }
                    }
                    break;
                }
                case 'remove': {
                    const entity = container.getEntity(id);
                    if (!entity) {
                        console.error(`[REMOVE] Unknown entity id: ${id}`);
                        break;
                    }
                    container.removeEntity(entity);
                    break;
                }
            }
        }
    });
}
