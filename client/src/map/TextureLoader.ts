import { BaseTexture, Texture } from 'pixi.js';
import { Loader, TileSet } from '@eversource/tmx-parser';
import { pixiLoader } from '../utils';
import Rectangle = PIXI.Rectangle;

interface NamedTextures {
    [key: string]: Texture | void;
}

class SpritesheetDetails {
    private namedTextures: NamedTextures = {};
    private tileSet: TileSet | null = null;

    constructor(fileName: string) {
        const baseTexture = BaseTexture.fromImage(`spritesheets/${fileName}.png`);

        new Loader(pixiLoader).parseFile(`spritesheets/${fileName}.xml`, (error, tileSet) => {
            if (error) {
                throw error;
            }
            const updateTiles = () => {
                this.updateTiles(baseTexture, tileSet as TileSet);
            };

            if (baseTexture.hasLoaded) {
                updateTiles();
            } else {
                baseTexture.once('loaded', updateTiles);
            }
        });
    }

    get(name: string): Texture {
        let result = this.namedTextures[name];
        if (!result) {
            result = emptyTexture();
            this.namedTextures[name] = result;
        }
        return result;
    }

    private updateTiles(baseTexture: BaseTexture, tileSet: TileSet) {

        this.tileSet = tileSet;
        const { image, tiles, tileWidth, tileHeight } = tileSet;
        tiles.forEach((tile, index) => {
            if (!tile) {
                return;
            }
            const name = (tile.properties as any).name;
            if(!name){
                return;
            }
            const texture = this.get(name);
            texture.baseTexture = baseTexture;

            const columns = image!.width / tileWidth; // TODO offset, margin
            const x = index % columns;
            const y = Math.floor(index / columns);

            texture.frame = new Rectangle(x * tileWidth, y * tileHeight, tileWidth, tileHeight);
        });
    }
}

export class TextureLoader {
    private textures = new Map<string, SpritesheetDetails>();

    get(fileName: string, name: string): Texture {

        let spritesheetDetails = this.textures.get(fileName);
        if (!spritesheetDetails) {
            spritesheetDetails = new SpritesheetDetails(fileName);
            this.textures.set(fileName, spritesheetDetails);
        }
        return spritesheetDetails.get(name);
    }
}

function emptyTexture(): Texture {
    return new Texture(Texture.EMPTY.baseTexture);
}
