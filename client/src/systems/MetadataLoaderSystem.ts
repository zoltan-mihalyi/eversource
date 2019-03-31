import * as PIXI from 'pixi.js';
import { EntityContainer } from '../../../common/es/EntityContainer';
import { ClientComponents } from '../es/ClientComponents';
import { TextureLoader } from '../loader/TextureLoader';
import { PartialPick } from '../../../common/util/Types';
import { Entity } from '../../../common/es/Entity';
import { getDirectoryAndFileName } from '../display/SimpleSprite';
import { HumanoidView, SimpleView } from '../../../common/components/View';

export function metadataLoaderSystem(container: EntityContainer<ClientComponents>, textureLoader: TextureLoader) {
    const entities = container.createQuery('display', 'view');

    entities.on('add', update);
    entities.on('update', update);

    function update({ display, view }: PartialPick<ClientComponents, 'display' | 'view'>, entitiy: Entity<ClientComponents>) {
        if (view.type === 'object') {
            entitiy.set('fixAnimationSpeed', null);
            return;
        }

        const tileSet = getTileSet(view);
        textureLoader.loadDetails(display, tileSet, (details) => {
            const { tileSet } = details;
            const properties = tileSet.properties || {};
            const animationSpeed = properties.animationSpeed;
            const size = properties.size;

            display.spriteContainer.hitArea = typeof properties.hitArea === 'string'
                ? rectFromString(properties.hitArea)
                : null as any;

            entitiy.set('fixAnimationSpeed', typeof animationSpeed === 'number' ? animationSpeed : null);
        });

    }
}

function getTileSet(view: SimpleView | HumanoidView): string {
    if (view.type === 'simple') {
        return getDirectoryAndFileName(view)[1];
    } else {
        return 'character';
    }
}

function rectFromString(hitAreaString: string): PIXI.Rectangle {
    return new PIXI.Rectangle(...hitAreaString.split(',').map(Number));
}