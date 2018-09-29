import * as PIXI from 'pixi.js';
import { ColoredImage } from '../../../common/domain/ColoredImage';
import { HumanoidEntityData } from '../../../common/domain/HumanoidEntityData';
import { UpdatableDisplay } from './UpdatableDisplay';

const PARTS = [
    'body',
    'eyes',
    'nose',
    'shirt',
    'feet',
    'legs',
    'chest',
    'hair',
    'ears',
    'head',
];

const DISPLAYED_PROPERTIES: (keyof HumanoidEntityData)[] = [
    'appearance',
    'equipment',
    'direction',
    'activity',
];

export class HumanoidDisplay extends UpdatableDisplay<HumanoidEntityData> {
    protected build() {
        const shadow = this.textureLoader.createAnimatedSprite('misc', 'shadow');
        shadow.blendMode = PIXI.BLEND_MODES.MULTIPLY;
        this.addChild(shadow);

        const { appearance, equipment, direction, activity } = this.data;

        const animation = activity + ':' + direction;

        for (const part of PARTS) {
            const holder = appearance.hasOwnProperty(part) ? appearance : equipment;
            const fullValue = (holder as any)[part] as ColoredImage;
            if (fullValue.length === 0) {
                continue;
            }

            if (equipment.head[0]) {
                if (part === 'hair' || part === 'ears') {
                    continue;
                }
            }
            const [value, color] = fullValue;

            let image: string;

            switch (part) {
                case 'ears':
                case 'nose':
                    image = `character/body/${appearance.sex}/${part}/${value}_${appearance.body[0]}`;
                    break;
                case 'eyes':
                    image = `character/body/${appearance.sex}/${part}/${value}`;
                    break;
                default:
                    image = `character/${part}/${appearance.sex}/${value}`;
            }

            const paletteFile = `character/${getPaletteFile(part, value)}`;
            const sprite = this.textureLoader.createCustomAnimatedSprite('character', image, animation, paletteFile, color);
            this.addChild(sprite);
        }
    }

    protected matches(changes: Partial<HumanoidEntityData>): boolean {
        for (const property of DISPLAYED_PROPERTIES) {
            if (changes.hasOwnProperty(property) && changes[property] !== this.data[property]) {
                return false;
            }
        }
        return true;
    }

    protected softUpdate() {
        const speed = this.calculateAnimationSpeed();
        for (const child of this.children) {
            (child as PIXI.extras.AnimatedSprite).animationSpeed = speed;
        }
    }

    private calculateAnimationSpeed(): number {
        switch (this.data.activity) {
            case 'standing':
                return 0.25;
            case 'walking':
                return this.data.activitySpeed / 20;
            case 'casting':
                return 0.25;
        }
    }
}

export function getPaletteFile(part: string, value: string) {
    switch (part) {
        case 'hair':
            return part;
        default:
            return `${part}/${value}`;
    }
}