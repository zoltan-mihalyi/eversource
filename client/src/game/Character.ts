import * as PIXI from 'pixi.js';
import { Appearance, CharacterAnimation, Direction, Equipment, GameObject } from '../../../common/GameObject';
import { TextureLoader } from '../map/TextureLoader';

const PARTS: (keyof Appearance | keyof Equipment)[] = [
    'body',
    'eyes',
    'nose',
    'shirt',
    'chest',
    'feet',
    'legs',
    'hair',
    'ears',
    'head',
];

class CharacterContainer extends PIXI.Container {
    private readonly direction: Direction;
    private readonly animation: CharacterAnimation;
    private readonly appearance: Appearance;
    private readonly equipment: Equipment;

    constructor(textureLoader: TextureLoader, object: GameObject) {
        super();

        const { appearance, equipment, direction, animation } = object;
        this.direction = direction;
        this.animation = animation;
        this.equipment = equipment;
        this.appearance = appearance;

        const name = animation + ':' + directionToName(direction);

        for (const part of PARTS) {
            const holder = appearance.hasOwnProperty(part) ? appearance : equipment;
            const value = (holder as Appearance & Equipment)[part];
            if (value === null) {
                continue;
            }
            if (equipment.head) {
                if (part === 'hair' || part === 'ears') {
                    continue;
                }
            }

            let image: string;

            switch (part) {
                case 'ears':
                case 'nose':
                    image = `character/body/${appearance.sex}/${part}/${value}_${appearance.body}`;
                    break;
                case 'eyes':
                    image = `character/body/${appearance.sex}/${part}/${value}`;
                    break;
                default:
                    image = `character/${part}/${appearance.sex}/${value}`;
            }

            this.addChild(textureLoader.createCustomAnimatedSprite('character', image, name));
        }
    }

    matches(object: GameObject): boolean {
        if (this.direction !== object.direction) {
            return false;
        }
        if (this.animation !== object.animation) {
            return false;
        }
        for (const key of Object.keys(this.appearance) as (keyof Appearance)[]) {
            if (this.appearance[key] !== object.appearance[key]) {
                return false;
            }
        }
        for (const key of Object.keys(this.equipment) as (keyof Equipment)[]) {
            if (this.equipment[key] !== object.equipment[key]) {
                return false;
            }
        }
        return true;
    }

    setAnimationSpeed(speed: number) {
        for (const child of this.children) {
            (child as PIXI.extras.AnimatedSprite).animationSpeed = speed;
        }
    }
}

export class Character extends PIXI.Container {
    private characterContainer: CharacterContainer;

    constructor(private textureLoader: TextureLoader, object: GameObject) {
        super();
        const shadow = this.textureLoader.createAnimatedSprite('misc', 'shadow');
        shadow.blendMode = PIXI.BLEND_MODES.MULTIPLY;
        shadow.x = 16;
        shadow.y = 38;
        this.addChild(shadow);

        this.characterContainer = this.createCharacterContainer(object);
    }

    update(object: GameObject) {
        const directionSprite = this.characterContainer;
        if (!directionSprite.matches(object)) {
            this.removeChild(directionSprite);
            directionSprite.destroy({ children: true });
            this.characterContainer = this.createCharacterContainer(object);
        }
        this.characterContainer.setAnimationSpeed(getAnimationSpeed(object));
    }

    private createCharacterContainer(object: GameObject): CharacterContainer {
        return this.addChild(new CharacterContainer(this.textureLoader, object));
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