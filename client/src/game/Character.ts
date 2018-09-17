import * as PIXI from 'pixi.js';
import { CharacterAnimation, Direction, GameObject } from '../../../common/GameObject';
import { TextureLoader } from '../map/TextureLoader';

interface DirectionSprite {
    direction: Direction;
    animation: CharacterAnimation;
    sprite: PIXI.extras.AnimatedSprite;
}

export class Character extends PIXI.Container {
    private directionSprite: DirectionSprite;

    constructor(private textureLoader: TextureLoader, object: GameObject) {
        super();
        const shadow = this.textureLoader.createAnimatedSprite('misc', 'shadow');
        shadow.blendMode = PIXI.BLEND_MODES.MULTIPLY;
        shadow.x = 16;
        shadow.y = 38;
        this.addChild(shadow);

        this.directionSprite = this.createDirectionSprite(object);
    }

    update(object: GameObject) {
        const directionSprite = this.directionSprite;
        if (directionSprite.direction !== object.direction || directionSprite.animation !== object.animation) {
            this.removeChild(directionSprite.sprite);
            directionSprite.sprite.destroy();
            this.directionSprite = this.createDirectionSprite(object);
        }
        this.directionSprite.sprite.animationSpeed = getAnimationSpeed(object);
    }

    private createDirectionSprite(object: GameObject): DirectionSprite {
        const sprite = this.textureLoader.createAnimatedSprite(object.type, toName(object.direction, object.animation));

        this.addChild(sprite);

        return {
            sprite,
            animation: object.animation,
            direction: object.direction,
        };
    }
}

function toName(direction: Direction, animation: CharacterAnimation): string {
    return animation + ':' + directionToName(direction);
}

function directionToName(direction: Direction): string {
    switch (direction) {
        case 'U':
            return 'up';
        case 'D':
            return 'down';
        case 'L':
            return 'left';
        case 'R':
            return 'right';
    }
}

function getAnimationSpeed(object: GameObject): number {
    switch (object.animation) {
        case 'standing':
            return 0.25;
        case 'walking':
            return object.speed / 20;
        case 'casting':
            return 0.25;
    }
}