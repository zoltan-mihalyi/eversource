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
    constructor(textureLoader: TextureLoader, readonly gameObject: GameObject) {
        super();

        const { appearance, equipment, direction, animation } = gameObject;

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
        this.updateAnimationSpeed();
    }

    matches(changes: Partial<GameObject>): boolean {
        const actual = this.gameObject;

        if (changes.direction && actual.direction !== changes.direction) {
            return false;
        }
        if (changes.animation && actual.animation !== changes.animation) {
            return false;
        }
        if (changes.appearance) {
            for (const key of Object.keys(actual.appearance) as (keyof Appearance)[]) {
                if (actual.appearance[key] !== changes.appearance[key]) {
                    return false;
                }
            }
        }
        if (changes.equipment) {
            for (const key of Object.keys(actual.equipment) as (keyof Equipment)[]) {
                if (actual.equipment[key] !== changes.equipment[key]) {
                    return false;
                }
            }
        }
        return true;
    }

    updateAnimationSpeed() {
        const speed = this.calculateAnimationSpeed();
        for (const child of this.children) {
            (child as PIXI.extras.AnimatedSprite).animationSpeed = speed;
        }
    }

    private calculateAnimationSpeed(): number {
        switch (this.gameObject.animation) {
            case 'standing':
                return 0.25;
            case 'walking':
                return this.gameObject.speed / 20;
            case 'casting':
                return 0.25;
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

    update(changes: Partial<GameObject>) {
        const directionSprite = this.characterContainer;
        if (!directionSprite.matches(changes)) {
            this.removeChild(directionSprite);
            directionSprite.destroy({ children: true });
            this.characterContainer = this.createCharacterContainer({
                ...directionSprite.gameObject,
                ...changes
            });
        } else {
            Object.assign(this.characterContainer.gameObject, changes);
        }
        this.characterContainer.updateAnimationSpeed();
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
