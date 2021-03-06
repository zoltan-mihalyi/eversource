import * as PIXI from 'pixi.js';
import { SpriteContainer, SpriteInteractionHandler } from './SpriteContainer';
import { EffectCache } from '../effects/EffectCache';

type ContainerKey =
    | 'shadowContainer'
    | 'spriteContainer'
    | 'statusContainer'
    | 'textContainer'
    | 'chatContainer'
    | 'interactionContainer';

export class EntityDisplay extends PIXI.Container {
    readonly effectCache = new EffectCache();

    readonly spriteContainer: SpriteContainer;
    readonly animationEffectBg = new PIXI.Container();
    readonly animationEffectFg = new PIXI.Container();
    private shadowContainer = new PIXI.Container();
    private statusContainer = new PIXI.Container();
    private textContainer = new PIXI.Container();
    private interactionContainer = new PIXI.Container();
    private chatContainer = new PIXI.Container();

    constructor(handler: SpriteInteractionHandler) {
        super();
        this.spriteContainer = new SpriteContainer(handler);

        this.addChild(
            this.shadowContainer,
            this.animationEffectBg,
            this.spriteContainer,
            this.animationEffectFg,
            this.statusContainer,
            this.textContainer,
            this.interactionContainer,
            this.chatContainer,
        );
    }

    setContent(containerKey: ContainerKey, content: PIXI.DisplayObject[]) {
        const container = this[containerKey];
        const removed = container.removeChildren() as PIXI.Container[];
        for (const child of removed) {
            child.destroy({ children: true });
        }

        for (const contentElement of content) {
            container.addChild(contentElement);
        }
    }

    setScale(scale: number) {
        this.shadowContainer.scale.set(scale);
        this.spriteContainer.scale.set(scale);
    }

    setAnimationSpeed(speed: number) {
        for (const child of this.spriteContainer.children) {
            (child as PIXI.extras.AnimatedSprite).animationSpeed = speed;
        }
    }

    updateStackingElementsPosition() {
        const spriteTop = this.spriteContainer.scale.y * this.spriteContainer.getLocalBounds().y;
        this.statusContainer.y = spriteTop - this.statusContainer.height + 4;
        this.textContainer.y = this.statusContainer.y - this.textContainer.height;
        this.chatContainer.y = this.textContainer.y - this.chatContainer.height - 1;
        this.interactionContainer.y = this.chatContainer.y;
    }
}
