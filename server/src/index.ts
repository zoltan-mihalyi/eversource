import { Server } from './Server';
import { WorldImpl } from './world/World';
import { TmxMapLoader } from './world/MapLoader';
import { FakeDao } from './impl/FakeDao';
import * as express from 'express';
import * as fs from 'fs';
import * as ws from 'ws';
import { monsterPresets } from '../data/monsterPresets';
import { registerWebRTCEndpoint } from './webrtc/WebRTCHandler';

const PORT = process.env.PORT ? +process.env.PORT : 8000;

const mapLoader = new TmxMapLoader('../common/maps');

const humanoidPresets = JSON.parse(fs.readFileSync('./data/presets.json', 'utf-8'));
const world = new WorldImpl(mapLoader, humanoidPresets, monsterPresets);

const app = express();
const webRRTCConnector = registerWebRTCEndpoint(app);
app.use(express.static('../cordova/www'));
const httpServer = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const gameServer = new Server(new FakeDao(), world);
gameServer.addConnector(new ws.Server({
    server: httpServer,
}));

gameServer.addConnector(webRRTCConnector);