import { EntityContainer } from '../../../../common/es/EntityContainer';
import { ClientComponents } from '../../es/ClientComponents';
import { PartialPick } from '../../../../common/util/Types';

export function displayScaleSystem(container: EntityContainer<ClientComponents>) {
    const entities = container.createQuery('display', 'scale');

    entities.on('add', updateScale);
    entities.on('update', updateScale);
    entities.on('remove', ({ display }) => {
        display.setScale(1);
    });
}

function updateScale({ display, scale }: PartialPick<ClientComponents, 'display' | 'scale'>) {
    display.setScale(scale.value);
}