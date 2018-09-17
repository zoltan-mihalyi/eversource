import { BaseTexture, Texture } from 'pixi.js';
import { Loader, TileSet } from '@eversource/tmx-parser';
import { pixiLoader } from '../utils';
import Rectangle = PIXI.Rectangle;
import AnimatedSprite = PIXI.extras.AnimatedSprite;

interface PendingAnimatedSprite {
    sprite: AnimatedSprite;
    name: string;
}

class SpritesheetDetails {
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

            const tileAnimations = tile.animations.map(anim => texture(anim.tileId));
            animations[name] = tileAnimations.length === 0 ? [texture(index)] : tileAnimations;
        });

        this.pendingAnimatedSprites.forEach(pendingAnimatedSprite => {
            pendingAnimatedSprite.sprite.textures = animations[pendingAnimatedSprite.name];
            pendingAnimatedSprite.sprite.play();
        });
        this.pendingAnimatedSprites.clear();

        function texture(index: number): Texture {
            const x = index % columns;
            const y = Math.floor(index / columns);
            return new PIXI.Texture(baseTexture, new Rectangle(x * tileWidth, y * tileHeight, tileWidth, tileHeight));
        }
    }
}

export class TextureLoader {
    private textures = new Map<string, SpritesheetDetails>();

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
