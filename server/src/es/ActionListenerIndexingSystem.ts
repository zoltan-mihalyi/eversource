import { EntityContainer } from '../../../common/es/EntityContainer';
import { ActionListener, ServerComponents } from './ServerComponents';
import { EventBus } from '../../../common/es/EventBus';
import { ServerEvents } from './ServerEvents';
import * as rbush from "rbush";

const DETECTION_DISTANCE = 16;

export interface ListenerBox extends rbush.BBox {
    actionListener: ActionListener;
}

export function actionListenerIndexingSystem(container: EntityContainer<ServerComponents>, eventBus: EventBus<ServerEvents>): rbush.RBush<ListenerBox> {
    const listeners = container.createQuery('actionListener', 'position');

    const listenerIndex = rbush<ListenerBox>();

    eventBus.on('update', () => {
        listenerIndex.clear();
        listeners.forEach(({ actionListener, position: { x, y } }) => {
            listenerIndex.insert({
                minX: x - DETECTION_DISTANCE,
                minY: y - DETECTION_DISTANCE,
                maxX: x + DETECTION_DISTANCE,
                maxY: y + DETECTION_DISTANCE,
                actionListener: actionListener,
            });
        });
    });

    return listenerIndex;
}