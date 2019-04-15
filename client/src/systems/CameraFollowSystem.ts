import { EventBus } from '../../../common/es/EventBus';
import { ClientEvents } from '../es/ClientEvents';
import { EntityContainer } from '../../../common/es/EntityContainer';
import { ClientComponents } from '../es/ClientComponents';
import { Position } from '../../../common/domain/Location';

export function cameraFollowSystem(container: EntityContainer<ClientComponents>,
                                   eventBus: EventBus<ClientEvents>, setViewCenter: (pos: Position) => void) {

    const playerEntities = container.createQuery('position', 'playerControllable');

    let lastPosition: Position | null = null;

    eventBus.on('render', () => {
        playerEntities.forEach(({ position }) => {
            if (position !== lastPosition) {
                lastPosition = position;
            }

            setViewCenter(position);
        });
    });
}
