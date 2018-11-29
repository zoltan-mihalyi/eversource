import { ColoredImage } from '../../../common/domain/ColoredImage';
import { HumanoidEntityData } from '../../../common/domain/HumanoidEntityData';
import { CreatureDisplay } from './CreatureDisplay';

const PARTS = [
    'cape_back',
    'body',
    'eyes',
    'nose',
    'feet',
    'legs',
    'shirt',
    'chest',
    'belt',
    'facial',
    'hair',
    'mask',
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

            if (equipment.head[0] && equipment.head[0] !== 'tiara') {
                if (part === 'hair' || part === 'ears') {
                    continue;
                }
            }
            let [value, color] = fullValue;

            let image: string;
            let paletteFile: string;
            switch (part) {
                case 'ears':
                case 'nose':
                    color = appearance.body[1];
                    image = `character/body/${appearance.sex}/${part}/${value}`;
                    paletteFile = `character/body/${appearance.body[0]}`;
                    break;
                default:
                    image = `character/${part}/${appearance.sex}/${value}`;
                    paletteFile = `character/${getPaletteFile(part, value)}`;
            }


            this.spriteContainer.addChild(this.createAnimatedSprite('character', image, paletteFile, color));
        }
    }
}

export function getPaletteFile(part: string, value: string) {
    switch (part) {
        case 'hair':
        case 'facial':
            return 'hair';
        default:
            return `${part}/${value}`;
    }
}