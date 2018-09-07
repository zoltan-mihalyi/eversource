import { Direction, Type } from '../../../common/GameObject';
import { BaseTexture, Texture } from 'pixi.js';
import { Loader, TileSet } from '@eversource/tmx-parser';
import { pixiLoader } from '../utils';
import Rectangle = PIXI.Rectangle;

type DirectionTextures = {
    [P in Direction]: Texture;
};

class CharacterDetails {
    private directionTextures: DirectionTextures = {
        U: emptyTexture(),
        L: emptyTexture(),
        D: emptyTexture(),
        R: emptyTexture(),
    };
    private tileSet: TileSet | null = null;

    constructor(type: Type) {
        const baseTexture = BaseTexture.fromImage(`spritesheets/${type}.png`);

        new Loader(pixiLoader).parseFile(`spritesheets/${type}.xml`, (error, tileSet) => {
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

    get(direction: Direction): Texture {
        return this.directionTextures[direction];
    }

    private updateTiles(baseTexture: BaseTexture, tileSet: TileSet) {

        this.tileSet = tileSet;
        const { image, tiles, tileWidth, tileHeight } = tileSet;
        tiles.forEach((tile, index) => {
            if (!tile) {
                return;
            }
            const direction = nameToDirection((tile.properties as any).name);
            if (direction === null) {
                return;
            }
            const directionTexture = this.directionTextures[direction];
            directionTexture.baseTexture = baseTexture;

            const columns = image!.width / tileWidth; // TODO offset, margin
            const x = index % columns;
            const y = Math.floor(index / columns);

            directionTexture.frame = new Rectangle(x * tileWidth, y * tileHeight, tileWidth, tileHeight)
        });
    }
}

export class CharacterLoader {
    private textures = new Map<Type, CharacterDetails>();

    get(type: Type, direction: Direction): Texture {

        let textureDetails = this.textures.get(type);
        if (!textureDetails) {
            textureDetails = new CharacterDetails(type);
            this.textures.set(type, textureDetails);
        }
        return textureDetails.get(direction);
    }
}

function emptyTexture(): Texture {
    return new Texture(Texture.EMPTY.baseTexture);
}

function nameToDirection(name: any): Direction | null {
    switch (name) {
        case 'left':
            return 'L';
        case 'right':
            return 'R';
        case 'up':
            return 'U';
        case 'down':
            return 'D';
        default:
            return null;
    }
}