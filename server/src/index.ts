import { Server } from './Server';
import { FakeUserDao } from './impl/FakeUserDao';
import { World } from './world/World';

const PORT = 8080;

const world = new World();

const server = new Server(() => new FakeUserDao(), world, PORT);
console.log(`Server running on port ${PORT}`);
