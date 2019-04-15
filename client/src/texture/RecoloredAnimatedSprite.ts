import * as PIXI from 'pixi.js';
import { Palettes } from '../game/Palettes';
import { MultiColorReplaceFilter } from "@pixi/filter-multi-color-replace";
import { taskQueue } from './SplitTextureSource';

export type AnyRenderer = PIXI.WebGLRenderer | PIXI.CanvasRenderer;

export class RecoloredAnimatedSprite extends PIXI.extras.AnimatedSprite {
    private recolor: number[][] = [];
    private waitingForLoad: { texture: PIXI.BaseTexture, cb: () => void } | null = null;

    constructor(private renderer: AnyRenderer, textures: PIXI.Texture[]) {
        super(textures);
    }

    setRecolor(palettes: Palettes, color: string) {
        const palette = palettes.variations[color];

        this.recolor = palettes.base.map((baseColorInfo, i) => [string2hex(baseColorInfo.color), string2hex(palette[i])]);

        this.ensureUsingRecolored();
    }

    setRecolorTextures(textures: PIXI.Texture[]) {
        this.textures = textures;
        if (this.waitingForLoad) {
            const { texture, cb } = this.waitingForLoad;
            texture.removeListener('loaded', cb);
            this.waitingForLoad = null;
        }
        this.ensureUsingRecolored();
    }

    private ensureUsingRecolored() {
        if (this.waitingForLoad) {
            return;
        }
        for (const texture of this.textures as PIXI.Texture[]) {
            if (!texture.baseTexture.hasLoaded) {
                const onLoad = () => {
                    this.waitingForLoad = null;
                    this.ensureUsingRecolored();
                };
                texture.baseTexture.once('loaded', onLoad);
                this.waitingForLoad = { texture: texture.baseTexture, cb: onLoad };
                return;
            }
        }

        this._textures = this.makeRecolored();
        this._texture = this._textures[this.currentFrame];
        this._textureID = -1;
    }

    private makeRecolored(): PIXI.Texture[] {
        return (this.textures as PIXI.Texture[]).map((texture) => { // TODO support AnimatedSpriteTextureTimeObject?
            const originalTexture = getOriginal(texture);

            if (this.recolor.length === 0) {
                return originalTexture;
            }

            const key = this.recolor + '';
            if (originalTexture.recolored[key]) {
                return originalTexture.recolored[key];
            }

            const baseTexture = this.makeRecoloredBaseTexture(originalTexture.baseTexture, key);

            const result = new PIXI.Texture(baseTexture, originalTexture.frame) as RecoloredTexture;
            result.original = originalTexture;
            originalTexture.recolored[key] = result;

            return result;
        });
    }

    private makeRecoloredBaseTexture(baseTexture: OriginalBaseTexture, key: string): PIXI.BaseRenderTexture {
        let recoloredTextures = baseTexture.recolored;
        if (!recoloredTextures) {
            recoloredTextures = {};
            baseTexture.recolored = recoloredTextures;
        }
        let recoloredBaseTexture = recoloredTextures[key];
        if (!recoloredBaseTexture) {
            recoloredBaseTexture = new PIXI.BaseRenderTexture(baseTexture.width, baseTexture.height);
            recoloredTextures[key] = recoloredBaseTexture;

            const sprite = new PIXI.Sprite(new PIXI.Texture(baseTexture));
            sprite.filters = [new MultiColorReplaceFilter(this.recolor, void 0, 16)];

            taskQueue.enqueue(()=> {
                this.renderer.render(sprite, new PIXI.RenderTexture(recoloredBaseTexture));
            });
        }

        return recoloredBaseTexture;
    }
}

interface OriginalTexture extends PIXI.Texture {
    recolored: { [key: string]: RecoloredTexture }
}

interface RecoloredTexture extends PIXI.Texture {
    original: OriginalTexture;
}

interface OriginalBaseTexture extends PIXI.BaseTexture {
    recolored?: { [key: string]: PIXI.BaseRenderTexture };
}

function getOriginal(texture: PIXI.Texture): OriginalTexture {
    if ((texture as RecoloredTexture).original) {
        return (texture as RecoloredTexture).original;
    }
    const result = texture as OriginalTexture;

    if (!result.recolored) {
        result.recolored = {};
    }
    return result;
}

function string2hex(color: string): number {
    return parseInt(color.substring(1), 16);
}