import * as ws from 'ws';
import { PROTOCOL_VERSION } from '../../common/protocol/Messages';
import { World } from './world/World';
import { NetworkLoop } from './NetworkLoop';
import * as url from 'url';
import * as http from 'http';
import { Dao, Password, User, UserName } from './dao/Dao';
import { ErrorCode } from '../../common/protocol/ErrorCode';
import { WebsocketCommandStream } from './protocol/WebsocketCommandStream';
import { ConnectionHandler } from './protocol/ConnectionHandler';

export class Server {
    private readonly server: ws.Server;
    private readonly networkLoop: NetworkLoop;

    constructor(private dao: Dao, private world: World, port: number) {
        this.server = new ws.Server({
            port,
        });

        this.server.on('connection', this.onConnection);

        this.networkLoop = new NetworkLoop();
        this.networkLoop.start();
    }

    close() {
        this.networkLoop.stop();
        this.server.close();
    }

    private onConnection = async (connection: ws, request: http.IncomingMessage) => {
        const commandStream = new WebsocketCommandStream(connection);

        const result = await this.verifyClient(request);
        if (typeof result === 'number') {
            commandStream.sendCommand('error', result);
            connection.close();
            return;
        }

        console.log(`User connected! Playing: ${this.server.clients.size}`);

        const userDao = this.dao.getUserDao(result);

        const handler = new ConnectionHandler(userDao, this.world, this.networkLoop, commandStream);
        connection.on('close', () => {
            console.log(`User disconnected! Playing: ${this.server.clients.size}`);
            handler.close();
        });
    };

    private async verifyClient(request: http.IncomingMessage): Promise<ErrorCode | User> {
        const queryParams = url.parse(request.url!, true).query;
        const { v, username, password } = queryParams;
        if (v !== PROTOCOL_VERSION.toString()) {
            return ErrorCode.VERSION_MISMATCH;
        }
        if (typeof username !== 'string' || typeof password !== 'string') {
            return ErrorCode.MISSING_PARAMETERS;
        }

        const user = await this.dao.verifyUser(username as UserName, password as Password);
        if (user === null) {
            return ErrorCode.INVALID_CREDENTIALS;
        }

        return user;
    }
}
