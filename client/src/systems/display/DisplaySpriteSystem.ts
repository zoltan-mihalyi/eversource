import { EntityContainer } from '../../../../common/es/EntityContainer';
import { ClientComponents } from '../../es/ClientComponents';
import * as PIXI from 'pixi.js';
import { PartialPick } from '../../../../common/util/Types';
import { TextureLoader } from '../../loader/TextureLoader';
import { buildHumanoidSprite } from '../../display/HumanoidSprite';
import { buildSimpleSprite } from '../../display/SimpleSprite';
import { Displayable } from '../../display/CreatureSprite';
import { HumanoidView, SimpleView } from '../../../../common/components/View';


export function displaySpriteSystem(container: EntityContainer<ClientComponents>, textureLoader: TextureLoader) {
    const displays = container.createQuery('display', 'view');

    displays.on('add', updateObjectDisplaySprite);
    displays.on('update', updateObjectDisplaySprite);
    displays.on('remove', ({ display, view }) => {
        if (view.type !== 'object') { //todo dup
            return;
        }

        display.setContent('spriteContainer', []);
    });

    function updateObjectDisplaySprite({ display, view }: PartialPick<ClientComponents, 'view' | 'display'>) {
        if (view.type !== 'object') {
            return;
        }
        const fileName = `object/${view.image}`;
        display.setContent('spriteContainer', [textureLoader.createCustomAnimatedSprite(fileName, fileName, view.animation, '')]);
    }


    const creatureDisplays = container.createQuery('display', 'view', 'activity', 'direction');

    creatureDisplays.on('add', updateCreatureDisplaySprite);
    creatureDisplays.on('update', updateCreatureDisplaySprite);
    creatureDisplays.on('remove', ({ view, display }) => {
        if (view.type === 'object') {
            return;
        }

        display.setContent('spriteContainer', []);
    });

    function updateCreatureDisplaySprite({ display, view, activity, direction }: PartialPick<ClientComponents, 'view' | 'display' | 'activity' | 'direction'>) {
        if (view.type == 'object') {
            return;
        }

        display.setContent('spriteContainer', buildSpriteContainerParts({
            textureLoader,
            view,
            activity,
            direction,
        }));
    }
}

export function buildSpriteContainerParts(displayable: Displayable<HumanoidView | SimpleView>): PIXI.DisplayObject[] {
    switch (displayable.view.type) {
        case 'humanoid':
            return buildHumanoidSprite(displayable as Displayable<HumanoidView>);
        case 'simple':
            return buildSimpleSprite(displayable as Displayable<SimpleView>);
    }
}
