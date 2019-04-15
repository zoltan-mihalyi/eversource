import { EventBus } from '../../../common/es/EventBus';
import { ServerEvents } from './ServerEvents';
import * as rbush from "rbush";
import { PositionBox } from './SpatialIndexingSystem';

const CHAT_DISTANCE = 18;

export function chatSystem(index: rbush.RBush<PositionBox>, eventBus: EventBus<ServerEvents>) {
    eventBus.on('chatMessage', ({ sender, text }) => {
        const { position, name } = sender.components;
        if (!position || !name) {
            return;
        }

        const { x, y } = position;

        const boxes = index.search({
            minX: x - CHAT_DISTANCE,
            minY: y - CHAT_DISTANCE,
            maxX: x + CHAT_DISTANCE,
            maxY: y + CHAT_DISTANCE,
        });


        for (const entity of boxes) {
            const { chatListener } = entity.entity.components;
            if (!chatListener) {
                continue;
            }

            chatListener.onChatMessage({
                sender: name.value,
                entityId: sender.id,
                text,
            });
        }
    });
}