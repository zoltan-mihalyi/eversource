import * as fs from 'fs';
import * as path from 'path';
import * as rimraf from 'rimraf';
import * as marked from 'marked';
import { convertMap } from './map/map-converter';
import mkdirp = require('mkdirp');

const CLIENT_MAPS = '../cordova/www/dist/maps';
const BASE_MAPS = '../common/maps';

function copyFile(file: string) {
    fs.writeFileSync(path.join(CLIENT_MAPS, file), fs.readFileSync(path.join(BASE_MAPS, file)));
}

rimraf.sync(CLIENT_MAPS);
mkdirp.sync(CLIENT_MAPS);
convertMap(path.join(BASE_MAPS, 'lavaland.json'), 'terrain-map-v7.json', 'terrain-v7.json', path.join(CLIENT_MAPS, 'lavaland.json'));
copyFile('adobe-2.json');
copyFile('adobe-2-dark.png');
copyFile('plants.json');
copyFile('plants.png');
copyFile('terrain-v7.json');
copyFile('terrain-v7.png');

const renderer = new marked.Renderer();
renderer.link = (href, title, text) => `<a target="_blank" href="${ href }" title="${ title }">${ text }</a>`;
fs.writeFileSync('../cordova/www/dist/authors.html', marked(fs.readFileSync('../AUTHORS.md', 'utf-8'), { renderer }));
