import * as PIXI from 'pixi.js';
import { BaseTexture, Texture } from 'pixi.js';

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

export function pixiLoader(file: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        const loader = new PIXI.loaders.Loader()
            .add('file', file)
            .load(() => {
                resolve((loader.resources.file.xhr as any).responseText); // TODO overhead? parsed twice?
            });
        loader.onError.add(reject);
    });
}

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

export function colorToNumber(color: string) {
    return parseInt(color.substring(1), 16);
}

export function withOpacity(color: string, opacity: number): string {
    const opacityHex = Math.floor(255 * opacity).toString(16);
    const suffix = opacityHex.length === 1 ? `0${opacityHex}` : opacityHex;
    return color + suffix;
}