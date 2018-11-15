import * as fs from 'fs';
import { Palettes } from '../../../client/src/game/Palettes';

const [from, to] = process.argv.slice(2);

const p1 = JSON.parse(fs.readFileSync(from, 'utf-8')) as Palettes;
const p2 = JSON.parse(fs.readFileSync(to, 'utf-8')) as Palettes;


for (const key of Object.keys(p1.variations)) {
    const variation = p1.variations[key];

    p1.variations[key] = variation.filter((color, i) => {
        const base = p1.base[i];

        return hasColorForPosition(base.coordinates);
    });
}

p1.base = p2.base;

fs.writeFileSync(from, JSON.stringify(p1, null, 2), 'utf-8');

function hasColorForPosition(coordinates: [number, number]): boolean {
    return p2.base.findIndex((base) => base.coordinates[0] === coordinates[0] && base.coordinates[1] === coordinates[1]) !== -1;
}