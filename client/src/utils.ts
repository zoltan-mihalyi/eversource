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

export function ajax(url:string, callback: (response: string) => void) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            callback(xhttp.responseText);
        }
    };
    xhttp.open('GET', url, true);
    xhttp.send();

}