import { ColoredImage, RequiredColoredImage } from '../domain/ColoredImage';
import { EquipmentSlotId } from '../domain/CharacterInfo';

export interface Appearance {
    sex: 'male' | 'female';
    body: RequiredColoredImage;
    ears: ColoredImage;
    eyes: ColoredImage;
    nose: ColoredImage;
    facial: ColoredImage;
    hair: ColoredImage;
}

export const EQUIPMENT_SLOTS: EquipmentSlotId[] = ['shirt', 'head', 'cape', 'belt', 'arms', 'chest', 'legs', 'hands', 'feet'];

export type EquipmentView = {
    [P in EquipmentSlotId | 'mask']: ColoredImage;
}

export interface HumanoidView {
    readonly type: 'humanoid';
    readonly appearance: Appearance;
    readonly equipment: EquipmentView;
}

export interface SimpleView {
    readonly type: 'simple';
    readonly image: string;
    readonly palette: string | null;
}

export interface ObjectView {
    readonly type: 'object';
    readonly image: string;
    readonly animation: string;
}

export type View = HumanoidView | SimpleView | ObjectView;
