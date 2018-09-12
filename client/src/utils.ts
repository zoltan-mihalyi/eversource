import * as PIXI from 'pixi.js';
import { Texture, BaseTexture } from 'pixi.js';

export interface ParsedCommand {
    command: string;
    data: any;
}


export function parseCommand(data: string): ParsedCommand {
    const separatorIndex = data.indexOf(':');

    if (separatorIndex === -1) {
        return {
            command: data,
            data: void 0,
        };
    } else {
        return {
            command: data.substring(0, separatorIndex),
            data: JSON.parse(data.substring(separatorIndex + 1)),
        }
    }
}

export const pixiLoader = (file: string, cb: (err: any, data: string) => void) => {
    const loader = new PIXI.loaders.Loader()
        .add('file', file)
        .load(() => {
            cb(null, (loader.resources.file.xhr as any).responseText);
        });
};

export function cleanupTextures() {
    cleanup(PIXI.utils.TextureCache);
    cleanup(PIXI.utils.BaseTextureCache);
}

function cleanup(textures: { [key: string]: Texture | BaseTexture }) {
    for (const key of Object.keys(textures)) {
        if (!textures[key]) {
            continue; // a texture with duplicate keys removed
        }
        textures[key].destroy();
    }

}