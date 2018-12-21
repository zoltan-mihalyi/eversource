import * as fs from "fs";
import * as path from "path";
import { Palettes } from '../../../client/src/game/Palettes';

export class DirectoryReader {
    constructor(private base: string) {
    }

    filesInDir(directory: string): string[] {
        return fs.readdirSync(path.join(this.base, directory))
            .filter(file => path.extname(file) !== '')
            .map(file => path.parse(file).name);
    }
}

export function getVariations(file: string) {
    try {
        const palettes = JSON.parse(fs.readFileSync(file, 'utf-8')) as Palettes;
        return Object.keys(palettes.variations);
    } catch (e) {
        return [];
    }
}