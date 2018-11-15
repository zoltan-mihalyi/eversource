import * as fs from 'fs';
import * as path from 'path';
import { Palettes } from '../../../client/src/game/Palettes';

const rootDir = '../cordova/www/spritesheets';

printLargePalettes(rootDir);

function printLargePalettes(dir: string) {

    const files = fs.readdirSync(dir);

    for (const file of files) {
        const resolvedFile = path.join(dir, file);

        if (file === 'palettes.json') {
            const palettes = JSON.parse(fs.readFileSync(resolvedFile, 'utf-8')) as Palettes;
            if (palettes.base.length > 16) {
                console.log(`${path.relative(rootDir, dir)}: ${palettes.base.length}`);
            }
        }

        if (fs.statSync(resolvedFile).isDirectory()) {
            printLargePalettes(resolvedFile);
        }
    }

}