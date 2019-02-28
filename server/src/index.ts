import { Server } from './Server';
import { AllPresets, WorldImpl } from './world/World';
import { TmxMapLoader } from './world/MapLoader';
import { FakeDao } from './impl/FakeDao';
import * as express from 'express';
import * as fs from 'fs';

const PORT = process.env.PORT ? +process.env.PORT : 8000;

const mapLoader = new TmxMapLoader('../common/maps');

const presets: AllPresets = {
    humanoid: JSON.parse(fs.readFileSync('./data/presets/humanoids.json', 'utf-8')),
    monster: JSON.parse(fs.readFileSync('./data/presets/monsters.json', 'utf-8')),
    object: JSON.parse(fs.readFileSync('./data/presets/objects.json', 'utf-8')),
};

const world = new WorldImpl(mapLoader, presets);

const app = express();
app.use(express.static('../cordova/www'));
const httpServer = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const gameServer = new Server(new FakeDao(), world, {
    server: httpServer,
});
