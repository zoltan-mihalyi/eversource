import { ColoredImage } from '../../../common/domain/ColoredImage';
import * as PIXI from 'pixi.js';
import { createAnimatedSprite, Displayable } from './CreatureSprite';
import { HumanoidView } from '../../../common/components/View';

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

export function buildHumanoidSprite(displayable: Displayable<HumanoidView>) {
    const { appearance, equipment } = displayable.view;

    const parts: PIXI.DisplayObject[] = [];

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

        parts.push(createAnimatedSprite(displayable, 'character', image, paletteFile, color));
    }

    return parts;
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
