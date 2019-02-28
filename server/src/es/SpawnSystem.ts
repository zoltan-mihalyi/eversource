import { ServerComponents, Spawner } from './ServerComponents';
import { EventBus } from '../../../common/es/EventBus';
import { ServerEvents } from './ServerEvents';
import { EntityContainer } from '../../../common/es/EntityContainer';
import { Entity } from '../../../common/es/Entity';
import { ServerEntityContainer } from './ServerEntityContainer';

export function spawnSystem(entityContainer: ServerEntityContainer, eventBus: EventBus<ServerEvents>) {
    const spawners = entityContainer.createQuery('spawner', 'spawnTimer');

    eventBus.on('kill', ({ killed }) => {
        entityContainer.removeEntity(killed); // TODO separate system?

        const { spawnedBy } = killed.components;
        if (!spawnedBy) {
            return;
        }

        const spawnerEntity = spawnedBy.spawner;
        const spawner = spawnerEntity.components.spawner;

        if (!spawner) {
            return;
        }

        spawnerEntity.set('spawnTimer', {
            nextSpawnTime: Date.now() + spawner.spawnTime,
        });
    });

    eventBus.on('init', () => {
        spawners.forEach(({ spawner }, spawnerEntity) => {
            spawn(spawner, spawnerEntity);
        });
    });

    eventBus.on('update', ({ now }) => {
        spawners.forEach((components, spawnerEntity) => {
            const { spawner, spawnTimer } = components;
            if (now >= spawnTimer.nextSpawnTime) {
                spawn(spawner, spawnerEntity);
            }
        });
    });

    function spawn(spawner: Spawner, entity: Entity<ServerComponents>) {
        entityContainer.createEntity({
            ...spawner.template,
            spawnedBy: { spawner: entity },
        });
        entity.unset('spawnTimer');
    }
}
