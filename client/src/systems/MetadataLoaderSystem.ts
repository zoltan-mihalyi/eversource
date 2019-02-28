import { EntityContainer } from '../../../common/es/EntityContainer';
import { ClientComponents } from '../es/ClientComponents';
import { TextureLoader } from '../map/TextureLoader';
import { PartialPick } from '../../../common/util/Types';
import { Entity } from '../../../common/es/Entity';
import { getDirectoryAndFileName } from '../display/SimpleSprite';

export function metadataLoaderSystem(container: EntityContainer<ClientComponents>, textureLoader: TextureLoader) {
    const entities = container.createQuery('display', 'view');

    entities.on('add', update);
    entities.on('update', update);

    function update({ display, view }: PartialPick<ClientComponents, 'display' | 'view'>, entitiy: Entity<ClientComponents>) {
        if (view.type === 'humanoid') {
            entitiy.set('fixAnimationSpeed', null);
            entitiy.set('shadowSize', 1);
            return;
        } else if (view.type === 'object') {
            entitiy.set('fixAnimationSpeed', null);
            return;
        }

        textureLoader.loadDetails(display, getDirectoryAndFileName(view)[1], (details) => {
            const { tileSet } = details;
            const properties = tileSet.properties || {};
            const animationSpeed = properties.animationSpeed;
            const size = properties.size;

            entitiy.set('shadowSize', typeof size === 'number' ? size : 1);
            entitiy.set('fixAnimationSpeed', typeof animationSpeed === 'number' ? animationSpeed : null);
        });

    }
}
