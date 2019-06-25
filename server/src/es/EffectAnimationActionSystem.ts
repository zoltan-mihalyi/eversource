import { EntityContainer } from '../../../common/es/EntityContainer';
import { CreatureSoundDescriptor, CreatureSoundKind, ServerComponents } from './ServerComponents';
import { EventBus } from '../../../common/es/EventBus';
import { ServerEvents } from './ServerEvents';
import { tryDispatchEffectAnimation, tryDispatchSoundEffect } from './ActionDispatcherSystem';
import { Entity } from '../../../common/es/Entity';


export function effectAnimationActionSystem(container: EntityContainer<ServerComponents>, //TODO rename
                                            eventBus: EventBus<ServerEvents>) {

    const entitiesWithLevel = container.createQuery('level');

    entitiesWithLevel.on('update', (components, entity) => {
        tryDispatchEffectAnimation(eventBus, entity, 'level-up', 'level-up');
        tryDispatchSoundEffect(eventBus, entity, 'levelup');
    });

    eventBus.on('hit', ({ source }) => {
        tryDispatchSoundEffect(eventBus, source, 'shoot');
    });

    eventBus.on('kill', ({ killed }) => {
        const { creatureSound } = killed.components;
        if (!creatureSound) {
            return;
        }
        tryDispatchCreatureSound(killed, creatureSound, 'die');
    });

    const noisyCreatures = container.createQuery('creatureSound');

    eventBus.on('update', () => {
        noisyCreatures.forEach(({ creatureSound }, entity) => {
            if (Math.random() * 100 < 0.1) {
                tryDispatchCreatureSound(entity, creatureSound, 'idle');
            }
        });
    });

    function tryDispatchCreatureSound(entity: Entity<ServerComponents>, sound: CreatureSoundDescriptor, kind: CreatureSoundKind) {
        const soundCount = sound[kind];
        if (soundCount === 0) {
            return;
        }
        const variant = Math.floor(Math.random() * soundCount) + 1;

        tryDispatchSoundEffect(eventBus, entity, `${sound.directory}/${kind}${variant}`);
    }
}
