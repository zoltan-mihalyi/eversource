import { ColoredImage } from '../../../common/domain/ColoredImage';
import { HumanoidEntityData } from '../../../common/domain/HumanoidEntityData';
import { CreatureDisplay } from './CreatureDisplay';

const PARTS = [
    'cape_back',
    'body',
    'eyes',
    'nose',
    'shirt',
    'feet',
    'legs',
    'chest',
    'belt',
    'hair',
    'ears',
    'arms',
    'hands',
    'head',
    'cape',
];

const DISPLAYED_PROPERTIES: (keyof HumanoidEntityData)[] = [
    'appearance',
    'equipment',
    'direction',
    'activity',
];

export class HumanoidDisplay extends CreatureDisplay<HumanoidEntityData> {
    protected displayedProperties = DISPLAYED_PROPERTIES;

    protected buildSprite() {
        const { appearance, equipment } = this.data;

        for (const part of PARTS) {
            const partProperty = part === 'cape_back' ? 'cape' : part;

            const holder = appearance.hasOwnProperty(partProperty) ? appearance : equipment;
            const fullValue = (holder as any)[partProperty] as ColoredImage;
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
                default:
                    image = `character/${part}/${appearance.sex}/${value}`;
            }

            const paletteFile = `character/${getPaletteFile(part, value)}`;
            this.spriteContainer.addChild(this.createAnimatedSprite('character', image, paletteFile, color));
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