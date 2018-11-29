import { ColoredImage, RequiredColoredImage } from './ColoredImage';
import { BaseCreatureEntityData } from './CreatureEntityData';

export interface Appearance {
    sex: 'male' | 'female';
    body: RequiredColoredImage;
    ears: ColoredImage;
    eyes: ColoredImage;
    nose: ColoredImage;
    facial: ColoredImage;
    hair: ColoredImage;
}

export interface Equipment {
    shirt: ColoredImage;
    head: ColoredImage;
    cape: ColoredImage;
    belt: ColoredImage;
    arms: ColoredImage;
    chest: ColoredImage;
    legs: ColoredImage;
    hands: ColoredImage;
    feet: ColoredImage;
}

export interface HumanoidEntityData extends BaseCreatureEntityData {
    type: 'humanoid';
    appearance: Appearance;
    equipment: Equipment;
}