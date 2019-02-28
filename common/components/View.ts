import { ColoredImage, RequiredColoredImage } from '../domain/ColoredImage';

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
    mask: ColoredImage;
}

export interface HumanoidView {
    readonly type: 'humanoid';
    readonly appearance: Appearance;
    readonly equipment: Equipment;
}

export interface SimpleView {
    readonly type: 'simple';
    readonly image: string;
    readonly palette: string | null;
}

export type View = HumanoidView | SimpleView;
