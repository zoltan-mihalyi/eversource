import { Server } from './Server';
import { WorldImpl } from './world/World';
import { TmxMapLoader } from './world/MapLoader';
import { FakeDao } from './impl/FakeDao';
import * as express from 'express';
import * as fs from 'fs';
import { monsterPresets } from '../data/monsterPresets';

const PORT = process.env.PORT ? +process.env.PORT : 8000;

const mapLoader = new TmxMapLoader('../common/maps');

const humanoidPresets = JSON.parse(fs.readFileSync('./data/presets.json', 'utf-8'));
const world = new WorldImpl(mapLoader, humanoidPresets, monsterPresets);

const app = express();
app.use(express.static('../cordova/www', { setHeaders }));
const httpServer = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const gameServer = new Server(new FakeDao(), world, {
    server: httpServer,
});

function setHeaders(res: express.Response, path: string) {
    if (path.endsWith('.png')) {
        res.header('Cache-Control', 'no-transform, public, max-age=0');
    }
}