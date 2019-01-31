import { EntityContainer } from '../../../common/es/EntityContainer';
import { Moving, ServerComponents } from './ServerComponents';
import { EventBus } from '../../../common/es/EventBus';
import { ServerEvents } from './ServerEvents';
import { Position, X, Y } from '../../../common/domain/Location';

const STANDING: Moving = {
    x: 0,
    y: 0,
    running: false,
};

//TODO test
export function aiMovingSystem(container: EntityContainer<ServerComponents>, eventBus: EventBus<ServerEvents>) {
    const entities = container.createQuery('position', 'aiMovingController');

    eventBus.on('update', ({ now }) => {
        entities.forEach((components, entity) => {
            if (components.listening) {
                entity.set('moving', STANDING);
                return;
            }

            const { position, aiMovingController } = components;
            const { initial, radiusX, radiusY, target, running, interval } = aiMovingController;

            const dx = target.x - position.x;
            const dy = target.y - position.y;

            const speed = 0.4; // TODO

            entity.set('moving', {
                running,
                x: Math.abs(dx) > 0.1 ? dx / speed : 0,
                y: Math.abs(dy) > 0.1 ? dy / speed : 0,
            });

            if (now >= aiMovingController.nextMoveTime) {
                aiMovingController.target = randomTarget(initial, radiusX, radiusY);
                aiMovingController.nextMoveTime = now + Math.random() * interval * 1000;
            }
        });
    });

    function randomTarget(initial: Position, radiusX: number, radiusY: number): Position {
        return {
            x: initial.x - radiusX + Math.random() * radiusX * 2 as X,
            y: initial.y - radiusY + Math.random() * radiusY * 2 as Y,
        };
    }
}
