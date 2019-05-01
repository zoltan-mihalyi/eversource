import { EntityContainer } from '../../../common/es/EntityContainer';
import { ServerComponents } from './ServerComponents';
import * as rbush from 'rbush';
import { ListenerBox } from './ActionListenerIndexingSystem';
import { Entity } from '../../../common/es/Entity';
import { EffectAnimationAction } from '../../../common/protocol/Messages';
import { EventBus } from '../../../common/es/EventBus';
import { ServerEvents } from './ServerEvents';

export function effectAnimationActionSystem(listenerIndex: rbush.RBush<ListenerBox>,
                                            container: EntityContainer<ServerComponents>, eventBus: EventBus<ServerEvents>) {

    const entitiesWithLevel = container.createQuery('level');

    entitiesWithLevel.on('update', (components, entity) => {
        eventBus.emit('effectAnimation', { target: entity, image: 'level-up', animation: 'level-up' })
    });

    eventBus.on('effectAnimation', ({ target, image, animation }) => createEffectAnimation(target, image, animation));

    function createEffectAnimation(entity: Entity<ServerComponents>, image: string, animation: string) {
        const { position } = entity.components;

        if (!position) {
            return;
        }

        const { x, y } = position;

        const listenerBoxes = listenerIndex.search({
            minX: x,
            minY: y,
            maxX: x,
            maxY: y,
        });

        const action: EffectAnimationAction = {
            type: 'effect',
            entityId: entity.id,
            effectAnimation: { image, animation },
        };

        for (const { actionListener } of listenerBoxes) {
            actionListener.onAction(action);
        }
    }
}