import { EventBus } from '../../../common/es/EventBus';
import { ClientEvents } from '../es/ClientEvents';
import { EntityContainer } from '../../../common/es/EntityContainer';
import { ClientComponents } from '../es/ClientComponents';
import { CameraPosition } from './CameraFollowSystem';
import { sfx } from '../audio/AudioEngine';


export function audioSystem(container: EntityContainer<ClientComponents>, eventBus: EventBus<ClientEvents>,
                            cameraPosition: CameraPosition) {

    eventBus.on('soundEffectAction', ({ name, entityId, volume }) => {
        const wrappedPanner = sfx.createPanner(13, 8, 360, 0);

        const entity = container.getEntity(entityId);

        const updatePannerPosition = () => {
            if (!entity) {
                return;
            }

            const { position } = entity.components;
            if (!position) {
                return;
            }
            wrappedPanner.updatePosition(position.x - cameraPosition.position.x, position.y - cameraPosition.position.y, 4);
        };
        updatePannerPosition();

        const audio = wrappedPanner.playSound(name, { volume, destroyOnEnd: wrappedPanner });
        audio.ontimeupdate = updatePannerPosition;
    });
}
