import * as path from "path";

export const wwwDir = path.resolve('..', 'cordova', 'www');

export interface Named {
    name: string;
}

function fileDialog(callback: (file: string) => void, enhance?: (input: HTMLInputElement) => void) {
    const input = document.createElement('input') as HTMLInputElement;
    input.type = 'file';
    input.onchange = () => {
        if (input.value) {
            callback(input.value);
        }
    };
    if (enhance) {
        enhance(input);
    }
    input.click();
}

export function saveFileDialog(file: string | null, callback: (file: string) => void) {
    fileDialog(callback, (input) => {
        (input as any).nwsaveas='palettes.json';
        if (file) {
            const dirName = path.dirname(file);
            const fileName = path.basename(file);

            (input as any).nwworkingdir = dirName;
            (input as any).nwsaveas = fileName;
        }
    });
}

export function openFileDialog(callback: (file: string) => void) {
    fileDialog(callback);
}