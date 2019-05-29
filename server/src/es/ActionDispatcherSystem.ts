import { EventBus } from '../../../common/es/EventBus';
import { ServerEvents } from './ServerEvents';
import * as rbush from "rbush";
import { ListenerBox } from './ActionListenerIndexingSystem';
import { Entity } from '../../../common/es/Entity';
import { ServerComponents } from './ServerComponents';
import { Action, EffectAnimationAction, SoundEffectAction } from '../../../common/protocol/Messages';

export function actionDispatcherSystem(listenerIndex: rbush.RBush<ListenerBox>, eventBus: EventBus<ServerEvents>) {
    eventBus.on('action', ({ action, position }) => {
        const { x, y } = position;

        const listenerBoxes = listenerIndex.search({
            minX: x,
            minY: y,
            maxX: x,
            maxY: y,
        });

        for (const { actionListener } of listenerBoxes) {
            actionListener.onAction(action);
        }
    });
}

function tryDispatchAction(eventBus: EventBus<ServerEvents>, entity: Entity<ServerComponents>, action: Action) {
    const { position } = entity.components;

    if (!position) {
        return;
    }

    eventBus.emit('action', {
        position,
        action,
    });
}

export function tryDispatchEffectAnimation(eventBus: EventBus<ServerEvents>, entity: Entity<ServerComponents>, image: string, animation: string) {
    const action: EffectAnimationAction = {
        type: 'effect',
        entityId: entity.id,
        effectAnimation: { image, animation },
    };

    tryDispatchAction(eventBus, entity, action);
}

export function tryDispatchPositionEffectAnimation(eventBus: EventBus<ServerEvents>, entity: Entity<ServerComponents>, image: string, animation: string) {
    const { position } = entity.components;

    if (!position) {
        return;
    }

    eventBus.emit('action', {
        position,
        action: {
            type: 'position-effect',
            effectAnimation: {
                image,
                animation,
            },
            position,
        },
    });
}

export function tryDispatchSoundEffect(eventBus: EventBus<ServerEvents>, entity: Entity<ServerComponents>, name: string, volume = 100) {
    const action: SoundEffectAction = {
        type: 'sound',
        entityId: entity.id,
        name,
        volume,
    };

    tryDispatchAction(eventBus, entity, action);
}