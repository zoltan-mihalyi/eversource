import { Server } from './Server';
import { WorldImpl } from './world/World';
import { TmxMapLoader } from './world/MapLoader';
import { FakeDao } from './impl/FakeDao';
import * as express from 'express';
import { createDataContainerFromFiles } from './data/DataContainer';
import * as EventEmitter from 'events';
import { PROTOCOL_VERSION } from '../../common/protocol/Messages';

const PORT = process.env.PORT ? +process.env.PORT : 8000;

const mapLoader = new TmxMapLoader('../common/maps');

const world = new WorldImpl(mapLoader, createDataContainerFromFiles('./data'));

const app = express();
app.use(express.static('../cordova/www'));
const httpServer = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const gameServer = new Server(new FakeDao(), world, {
    server: httpServer,
});

class FakeConn extends EventEmitter {
    readyState = 1;

    constructor(private send: (data: string) => void) {
        super();
    }

    close() {
    }

}

for (let i = 0; i < 100; i++) {

    const conn = new FakeConn((data) => {
        process.nextTick(() => {
            if (data.startsWith('characters')) {
                conn.emit('message', 'enter:1'); //+Math.floor(Math.random()*3));
                conn.emit('message', 'ready');
            }
            // console.log(data.substring(0,data.indexOf(':')))
        });

    });

    (gameServer as any).server.emit('connection', conn);
    conn.emit('message', JSON.stringify({
        v: PROTOCOL_VERSION,
        username: '',
        password: '',
    }));
}


