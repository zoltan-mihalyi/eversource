import { SimpleView } from '../../../common/components/View';
import * as PIXI from 'pixi.js';
import { createAnimatedSprite, Displayable } from './CreatureSprite';

export function buildSimpleSprite(displayable: Displayable<SimpleView>): PIXI.DisplayObject[] {
    const { palette } = displayable.view;

    const [directory, fileName] = getDirectoryAndFileName(displayable.view);

    return [createAnimatedSprite(displayable, fileName, fileName, directory, palette || void 0)];
}


export function getDirectoryAndFileName(view: SimpleView): [string, string] {
    const { image } = view;
    const directory = `monster/${image}`;
    const fileName = `${directory}/${image}`;
    return [directory, fileName];
}
