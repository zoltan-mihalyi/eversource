import * as PIXI from 'pixi.js';
import { displaySystem } from './DisplaySystem';
import { displayNameSystem } from './DisplayNameSystem';
import { displayHealthBarSystem } from './DisplayHealthBarSystem';
import { displayScaleSystem } from './DisplayScaleSystem';
import { DisplayPositionSystem } from './DisplayPositionSystem';
import { displaySpriteSystem } from './DisplaySpriteSystem';
import { displayPossibleInteractionsSystem } from './DisplayPossibleInteractionsSystem';
import { displayShadowSystem } from './DisplayShadowSystem';
import { displayEffectsSystem } from './DisplayEffectsSystem';
import { displayAnimationSystem } from './DisplayAnimationSystem';
import { metadataLoaderSystem } from '../MetadataLoaderSystem';
import { EntityContainer } from '../../../../common/es/EntityContainer';
import { ClientComponents } from '../../es/ClientComponents';
import { EventBus } from '../../../../common/es/EventBus';
import { ClientEvents } from '../../es/ClientEvents';
import { Metric } from './Metric';
import { TextureLoader } from '../../loader/TextureLoader';
import { displayChatSystem } from './DisplayChatSystem';

export function completeDisplaySystem(entityContainer: EntityContainer<ClientComponents>,
                                      eventBus: EventBus<ClientEvents>, metric: Metric, textureLoader:TextureLoader) {

    const objectContainer = new PIXI.Container();

    displaySystem(objectContainer, entityContainer, eventBus);
    displayNameSystem(entityContainer, eventBus);
    displayHealthBarSystem(entityContainer, eventBus);
    displayScaleSystem(entityContainer);
    new DisplayPositionSystem(objectContainer, metric, entityContainer, eventBus);
    displaySpriteSystem(entityContainer, textureLoader);
    displayPossibleInteractionsSystem(entityContainer, textureLoader);
    displayShadowSystem(entityContainer, textureLoader);
    displayEffectsSystem(entityContainer);
    displayAnimationSystem(entityContainer, eventBus);
    metadataLoaderSystem(entityContainer, textureLoader);
    displayChatSystem(entityContainer, eventBus, metric);
    return objectContainer;
}
