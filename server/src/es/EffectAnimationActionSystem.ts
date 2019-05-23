import { EntityContainer } from '../../../common/es/EntityContainer';
import { ServerComponents } from './ServerComponents';
import { EventBus } from '../../../common/es/EventBus';
import { ServerEvents } from './ServerEvents';
import { tryDispatchEffectAnimation, tryDispatchSoundEffect } from './ActionDispatcherSystem';

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
        const { killSound } = killed.components;
        if (killSound) {
            tryDispatchSoundEffect(eventBus, killed, killSound, 50);
        }
    });
}