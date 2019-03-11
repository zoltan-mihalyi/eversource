import * as PIXI from 'pixi.js';
import { TextureLoader } from '../loader/TextureLoader';
import { Activity, Direction } from '../../../common/components/CommonComponents';
import { View } from '../../../common/components/View';

export interface Displayable<T extends View = View> {
    textureLoader: TextureLoader;
    view: T;
    activity: Activity;
    direction: Direction;
}

export function createAnimatedSprite(displayable: Displayable, tileSet: string, image: string, paletteFile: string,
                                     color?: string): PIXI.extras.AnimatedSprite {

    const animation = displayable.activity + ':' + displayable.direction;
    return displayable.textureLoader.createCustomAnimatedSprite(tileSet, image, animation, paletteFile, color);
}
