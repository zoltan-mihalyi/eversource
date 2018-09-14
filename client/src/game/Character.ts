import * as PIXI from 'pixi.js';
import { Direction, GameObject } from '../../../common/GameObject';
import { TextureLoader } from '../map/TextureLoader';
import Sprite = PIXI.Sprite;

interface DirectionSprite {
    direction: Direction;
    sprite: Sprite;
}

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
        if (this.directionSprite.direction !== object.direction) {
            this.removeChild(this.directionSprite.sprite);
            this.directionSprite = this.createDirectionSprite(object);
        }
    }

    private createDirectionSprite(object: GameObject): DirectionSprite {
        const sprite = new PIXI.Sprite(this.textureLoader.get(object.type, directionToName(object.direction)));
        this.addChild(sprite);

        return {
            sprite,
            direction: object.direction,
        };
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