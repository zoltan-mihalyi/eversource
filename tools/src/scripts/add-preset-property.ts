import * as path from 'path';
import * as fs from 'fs';

interface Presets {
    [id: string]: any;
}

const rootDir = '../server/data/presets';

const params = process.argv.slice(2);
const [presetFiles, property, defaultValueString] = params;

if (params.length !== 3) {
    console.error(`got params: ${params}`);
    console.error('Usage: ts-node add-preset-property.ts presetFile1.json,presetFile2.json property defaultValueJson');
    process.exit(1);
}

const filesArray = presetFiles.split(',');
const defaultValue = JSON.parse(defaultValueString);

for (const file of filesArray) {
    const fullPath = path.join(rootDir, file);
    const presets = JSON.parse(fs.readFileSync(fullPath, 'utf-8')) as Presets;

    const keys = Object.keys(presets);
    for (const key of keys) {
        presets[key][property] = defaultValue;
    }

    fs.writeFileSync(fullPath, JSON.stringify(presets, null, 2), 'utf-8');
    console.log(`Updated ${keys.length} entries in ${fullPath}`)
}