import { Server } from './Server';
import { WorldImpl } from './world/World';
import { TmxGridLoader } from './world/GridLoader';
import { FakeDao } from './impl/FakeDao';
import * as express from 'express';

const PORT = process.env.PORT ? +process.env.PORT : 8080;

const gridLoader = new TmxGridLoader('../common/maps');

const world = new WorldImpl(gridLoader);

const app = express();
app.use(express.static('../cordova/www'));
const httpServer = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const gameServer = new Server(new FakeDao(), world, {
    server: httpServer,
});
