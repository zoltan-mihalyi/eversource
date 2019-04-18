import { EntityContainer } from '../../../common/es/EntityContainer';
import { ServerComponents } from './ServerComponents';
import * as rbush from 'rbush';
import { ListenerBox } from './ActionListenerIndexingSystem';
import { Entity } from '../../../common/es/Entity';
import { EffectAnimationAction } from '../../../common/protocol/Messages';

export function effectAnimationActionSystem(listenerIndex: rbush.RBush<ListenerBox>, container: EntityContainer<ServerComponents>) {
    const entitiesWithLevel = container.createQuery('level');

    entitiesWithLevel.on('update', (components, entity) => {
        createEffectAnimation(entity, 'level-up', 'level-up');
    });

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
            effectAnimation: { image, animation }
        };

        for (const { actionListener } of listenerBoxes) {
            actionListener.onAction(action);
        }
    }
}