import { Texture } from 'pixi.js';
import { TileSet } from '@eversource/tmx-parser';
import { SplitTexture } from '@eversource/pixi-texture-splitter';
import ResourceDictionary = PIXI.loaders.ResourceDictionary;

export class TexturedTileSet {
    readonly firstGid: number;
    readonly textures: Texture[] = [];

    constructor(tileSet: TileSet, images: ResourceDictionary) {
        this.firstGid = tileSet.firstGid;
        const image = tileSet.image!;
        const splitTexture = new SplitTexture(images[image.source].texture.baseTexture, 2048, 2048);

        for (let y = tileSet.margin; y < image.height; y += tileSet.tileHeight + tileSet.spacing) {
            for (let x = tileSet.margin; x < image.width; x += tileSet.tileWidth + tileSet.spacing) {
                this.textures.push(splitTexture.subTexture(x, y, tileSet.tileWidth, tileSet.tileHeight));
            }
        }
    }
}
