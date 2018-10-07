import { ColoredImage } from '../../../common/domain/ColoredImage';
import { HumanoidEntityData } from '../../../common/domain/HumanoidEntityData';
import { CreatureDisplay } from './CreatureDisplay';

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
    'arms',
    'hands',
    'head',
];

const DISPLAYED_PROPERTIES: (keyof HumanoidEntityData)[] = [
    'appearance',
    'equipment',
    'direction',
    'activity',
];

export class HumanoidDisplay extends CreatureDisplay<HumanoidEntityData> {
    protected displayedProperties = DISPLAYED_PROPERTIES;

    protected build() {
        super.build();

        const { appearance, equipment } = this.data;

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
            this.addChild(this.createAnimatedSprite('character', image, paletteFile, color));
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