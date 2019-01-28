import * as PIXI from 'pixi.js';
import { EntityContainer } from '../../../../common/es/EntityContainer';
import { ClientComponents } from '../../es/ClientComponents';
import { PartialPick } from '../../../../common/util/Types';
import { TextureLoader } from '../../loader/TextureLoader';

export function displayShadowSystem(container: EntityContainer<ClientComponents>, textureLoader: TextureLoader) {
    const entities = container.createQuery('display', 'shadowSize', 'shadowAlpha');

    entities.on('add', updateShadow);
    entities.on('update', updateShadow);
    entities.on('remove', ({ display }) => {
        display.setContent('shadowContainer', []);
    });

    function updateShadow({ display, shadowSize, shadowAlpha }: PartialPick<ClientComponents, 'display' | 'shadowSize' | 'shadowAlpha'>) {
        const shadow = textureLoader.createAnimatedSprite('misc', 'shadow');
        shadow.blendMode = PIXI.BLEND_MODES.MULTIPLY;
        shadow.scale.set(shadowSize);
        shadow.alpha = shadowAlpha;
        display.setContent('shadowContainer', [shadow]);
    }
}
