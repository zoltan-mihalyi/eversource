import { EventBus } from '../../../common/es/EventBus';
import { ServerEvents } from './ServerEvents';
import * as rbush from "rbush";
import { ListenerBox } from './ActionListenerIndexingSystem';

export function chatSystem(listenerIndex: rbush.RBush<ListenerBox>, eventBus: EventBus<ServerEvents>) {
    eventBus.on('chatMessage', ({ sender, text }) => {
        const { position, name } = sender.components;
        if (!position || !name) {
            return;
        }

        const { x, y } = position;

        const boxes = listenerIndex.search({
            minX: x,
            minY: y,
            maxX: x,
            maxY: y
        });

        const message = {
            sender: name.value,
            entityId: sender.id,
            text,
        };

        for (const { actionListener } of boxes) {
            actionListener.onChatMessage(message);
        }
    });
}