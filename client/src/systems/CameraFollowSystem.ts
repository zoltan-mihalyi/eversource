import { EventBus } from '../../../common/es/EventBus';
import { ClientEvents } from '../es/ClientEvents';
import { EntityContainer } from '../../../common/es/EntityContainer';
import { ClientComponents } from '../es/ClientComponents';
import { Position, X, Y } from '../../../common/domain/Location';

export interface CameraPosition {
    position:Position;
}

export function cameraFollowSystem(container: EntityContainer<ClientComponents>,
                                   eventBus: EventBus<ClientEvents>, setViewCenter: (pos: Position) => void):CameraPosition {

    const playerEntities = container.createQuery('position', 'playerControllable');

    const cameraPosition: CameraPosition = {
        position: { x: 0 as X, y: 0 as Y },
    };

    eventBus.on('render', () => {
        playerEntities.forEach(({ position }) => {
            if (position !== cameraPosition.position) {
                cameraPosition.position = position;
            }

            setViewCenter(position);
        });
    });

    return cameraPosition;
}
