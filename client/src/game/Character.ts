import * as PIXI from 'pixi.js';
import { Sprite } from 'pixi.js';
import { Direction, GameObject } from '../../../common/GameObject';
import { TextureLoader } from '../map/TextureLoader';

interface BaseDirectionSprite {
    direction: Direction;
    standing: boolean;
    sprite: Sprite;
}

interface StandingSprite extends BaseDirectionSprite{
    standing: true;
}

interface WalkingSprite extends BaseDirectionSprite{
    standing: false;
    sprite:PIXI.extras.AnimatedSprite;
}

type DirectionSprite= StandingSprite | WalkingSprite;

export class Character extends PIXI.Container {
    private directionSprite: DirectionSprite;

    constructor(private textureLoader: TextureLoader, object: GameObject) {
        super();
        const shadow = new PIXI.Sprite(this.textureLoader.get('misc', 'shadow'));
        shadow.blendMode = PIXI.BLEND_MODES.MULTIPLY;
        shadow.x = 16;
        shadow.y = 38;
        this.addChild(shadow);

        this.directionSprite = this.createDirectionSprite(object);
    }

    update(object: GameObject) {
        const standing = isStanding(object);
        if (this.directionSprite.direction !== object.direction || this.directionSprite.standing !== standing) {
            this.removeChild(this.directionSprite.sprite);
            this.directionSprite.sprite.destroy();
            this.directionSprite = this.createDirectionSprite(object);
        }
        if (!this.directionSprite.standing) {
            this.directionSprite.sprite.animationSpeed = getSpeed(object);
        }
    }

    private createDirectionSprite(object: GameObject): DirectionSprite {
        let sprite;
        const standing = isStanding(object);
        if (standing) {
            sprite = new PIXI.Sprite(this.textureLoader.get(object.type, directionToName(object.direction)));
        } else {
            sprite = this.textureLoader.createAnimatedSprite(object.type, directionToName(object.direction));
        }

        this.addChild(sprite);

        return {
            sprite,
            standing,
            direction: object.direction,
        } as DirectionSprite;
    }
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

function isStanding(object: GameObject): boolean {
    return object.speed.x === 0 && object.speed.y === 0
}

function getSpeed(object: GameObject): number {
    const { speed } = object;
    return (Math.abs(speed.x) + Math.abs(speed.y)) / 20;
}