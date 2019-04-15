import { EntityContainer } from '../../../../common/es/EntityContainer';
import { ClientComponents } from '../../es/ClientComponents';
import * as PIXI from 'pixi.js';
import { EntityDisplay } from '../../display/EntityDisplay';
import { EventBus } from '../../../../common/es/EventBus';
import { ClientEvents } from '../../es/ClientEvents';

export function displaySystem(objectContainer: PIXI.Container, container: EntityContainer<ClientComponents>,
                              eventBus: EventBus<ClientEvents>) {

    const views = container.createQuery('position', 'view');

    views.on('add', ({ view, position }, entity) => {
        const display = new EntityDisplay({
            onClick: () => {
                eventBus.emit('interact', entity.id);
            },
            onMouseOverChange: (mouseOver) => {
                if (mouseOver) {
                    entity.set('mouseOver', true);
                } else {
                    entity.unset('mouseOver');
                }
            },
        });
        entity.set('display', display);

        objectContainer.addChild(display);
    });

    views.on('remove', ({ view, position, display }) => {
        if (!display) {
            return;
        }

        objectContainer.removeChild(display);
    });
}
