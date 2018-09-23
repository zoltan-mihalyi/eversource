import { X, Y } from './domain/Location';
import { Opaque } from './util/Opaque';

export type Direction = 'U' | 'D' | 'L' | 'R';

export interface Position {
    x: X;
    y: Y;
}

export type ObjectId = Opaque<number, 'ObjectId'>;

interface BaseGameObject {
    type: string;
    position: Position;
}

export type CharacterAnimation = 'standing' | 'walking' | 'casting';

type RequiredColoredImage = [string] | [string, string];
export type ColoredImage = [] | RequiredColoredImage;

export interface Appearance {
    sex: 'male' | 'female';
    body: RequiredColoredImage;
    ears: ColoredImage;
    eyes: ColoredImage;
    nose: ColoredImage;
    hair: ColoredImage;
}

export interface Equipment {
    shirt: ColoredImage;
    head: ColoredImage;
    chest: ColoredImage;
    legs: ColoredImage;
    feet: ColoredImage;
}

export interface CharacterGameObject extends BaseGameObject {
    type: 'character';
    animation: CharacterAnimation;
    direction: Direction;
    appearance: Appearance;
    equipment: Equipment;
    speed: number;
}

export type  GameObject = CharacterGameObject;
