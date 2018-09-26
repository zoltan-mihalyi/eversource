import { Rectangle, Texture } from 'pixi.js';
import ResourceDictionary = PIXI.loaders.ResourceDictionary;
import { ResolvedTileSet } from '../../../common/tiled/TiledResolver';

export class TexturedTileSet {
    readonly firstGid: number;
    readonly textures: Texture[] = [];

    constructor(tileSet: ResolvedTileSet, images: ResourceDictionary) {
        this.firstGid = tileSet.firstgid;
        const image = tileSet.image;
        const baseTexture = images[image].texture.baseTexture;

        for (let y = tileSet.margin; y < tileSet.imageheight; y += tileSet.tileheight + tileSet.spacing) {
            for (let x = tileSet.margin; x < tileSet.imagewidth; x += tileSet.tilewidth + tileSet.spacing) {
                this.textures.push(new Texture(baseTexture, new Rectangle(x, y, tileSet.tilewidth, tileSet.tileheight)));
            }
        }
    }
}
