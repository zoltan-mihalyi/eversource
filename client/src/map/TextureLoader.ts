import { BaseTexture, Texture } from 'pixi.js';
import { Loader, TileSet } from '@eversource/tmx-parser';
import { pixiLoader } from '../utils';
import Rectangle = PIXI.Rectangle;
import AnimatedSprite = PIXI.extras.AnimatedSprite;

interface NamedTextures {
    [key: string]: Texture | void;
}

interface PendingAnimatedSprite {
    sprite: AnimatedSprite;
    name: string;
}

class SpritesheetDetails {
    private namedTextures: NamedTextures = {};
    private animations: { [key: string]: Texture[] } | null = null;
    private pendingAnimatedSprites = new Set<PendingAnimatedSprite>();
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

    createAnimatedSprite(name: string): PIXI.extras.AnimatedSprite {
        if (this.animations) {
            const sprite = new PIXI.extras.AnimatedSprite(this.animations[name]);
            sprite.play();
            return sprite;
        } else {
            const sprite = new PIXI.extras.AnimatedSprite([Texture.EMPTY]);
            const pendingAnimatedSprite = {
                name,
                sprite,
            };
            this.pendingAnimatedSprites.add(pendingAnimatedSprite);
            sprite.destroy = (options) => {
                PIXI.extras.AnimatedSprite.prototype.destroy.call(sprite, options);
                this.pendingAnimatedSprites.delete(pendingAnimatedSprite);
            };
            return sprite;
        }

    }

    private updateTiles(baseTexture: BaseTexture, tileSet: TileSet) {

        this.tileSet = tileSet;
        const { image, tiles, tileWidth, tileHeight } = tileSet;

        const columns = image!.width / tileWidth; // TODO offset, margin
        const animations: { [key: string]: Texture[] } = {};
        this.animations = animations;
        tiles.forEach((tile, index) => {
            if (!tile) {
                return;
            }
            const name = (tile.properties as any).name;
            if (!name) {
                return;
            }

            animations[name] = tile.animations.map(anim => new PIXI.Texture(baseTexture, tileFrame(anim.tileId)));

            const texture = this.get(name);
            texture.baseTexture = baseTexture;

            texture.frame = tileFrame(index);
        });

        this.pendingAnimatedSprites.forEach(pendingAnimatedSprite => {
            pendingAnimatedSprite.sprite.textures = animations[pendingAnimatedSprite.name];
            pendingAnimatedSprite.sprite.play();
        });
        this.pendingAnimatedSprites.clear();

        function tileFrame(index: number): Rectangle {
            const x = index % columns;
            const y = Math.floor(index / columns);
            return new Rectangle(x * tileWidth, y * tileHeight, tileWidth, tileHeight);
        }
    }
}

export class TextureLoader {
    private textures = new Map<string, SpritesheetDetails>();

    get(fileName: string, name: string): Texture {
        return this.getSpritesheetDetails(fileName).get(name);
    }

    createAnimatedSprite(fileName: string, name: string): PIXI.extras.AnimatedSprite {
        return this.getSpritesheetDetails(fileName).createAnimatedSprite(name);
    }

    private getSpritesheetDetails(fileName: string): SpritesheetDetails {
        let spritesheetDetails = this.textures.get(fileName);
        if (!spritesheetDetails) {
            spritesheetDetails = new SpritesheetDetails(fileName);
            this.textures.set(fileName, spritesheetDetails);
        }
        return spritesheetDetails;
    }
}

function emptyTexture(): Texture {
    return new Texture(Texture.EMPTY.baseTexture);
}
