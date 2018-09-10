import { Server } from './Server';
import { FakeUserDao } from './impl/FakeUserDao';
import { WorldImpl } from './world/World';
import { TmxGridLoader } from './world/GridLoader';
import { FakeDao } from './impl/FakeDao';

const PORT = 8080;

const gridLoader = new TmxGridLoader('../common/maps');

const world = new WorldImpl(gridLoader);

const server = new Server(new FakeDao(), world, PORT);
console.log(`Server running on port ${PORT}`);
