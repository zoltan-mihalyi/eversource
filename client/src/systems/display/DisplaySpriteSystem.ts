import { EntityContainer } from '../../../../common/es/EntityContainer';
import { ClientComponents } from '../../es/ClientComponents';
import * as PIXI from 'pixi.js';
import { PartialPick } from '../../../../common/util/Types';
import { TextureLoader } from '../../map/TextureLoader';
import { buildHumanoidSprite } from '../../display/HumanoidSprite';
import { buildSimpleSprite } from '../../display/SimpleSprite';
import { Displayable } from '../../display/CreatureSprite';
import { HumanoidView, SimpleView } from '../../../../common/components/View';


export function displaySpriteSystem(container: EntityContainer<ClientComponents>, textureLoader: TextureLoader) {
    const displays = container.createQuery('display', 'view', 'activity', 'direction');

    displays.on('add', updateDisplayView);
    displays.on('update', updateDisplayView);
    displays.on('remove', ({ display }) => {
        display.setContent('spriteContainer', []);
    });

    function updateDisplayView({ display, view, activity, direction }: PartialPick<ClientComponents, 'view' | 'display' | 'activity' | 'direction'>) {
        display.setContent('spriteContainer', buildSpriteContainerParts({
            textureLoader,
            view,
            activity,
            direction,
        }));
    }
}

export function buildSpriteContainerParts(displayable: Displayable): PIXI.DisplayObject[] {
    switch (displayable.view.type) {
        case 'humanoid':
            return buildHumanoidSprite(displayable as Displayable<HumanoidView>);
        case 'simple':
            return buildSimpleSprite(displayable as Displayable<SimpleView>);
    }
}