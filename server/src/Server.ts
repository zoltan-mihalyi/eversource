import * as ws from 'ws';
import { ServerOptions } from 'ws';
import { PROTOCOL_VERSION } from '../../common/protocol/Messages';
import { World } from './world/World';
import { NetworkLoop } from './NetworkLoop';
import { Dao, Password, User, UserName } from './dao/Dao';
import { ErrorCode } from '../../common/protocol/ErrorCode';
import { WebsocketCommandStream } from './protocol/WebsocketCommandStream';
import { ConnectionHandler } from './protocol/ConnectionHandler';

export class Server {
    private readonly server: ws.Server;
    private readonly networkLoop: NetworkLoop;

    constructor(private dao: Dao, private world: World, options: ServerOptions) {
        this.server = new ws.Server(options);

        this.server.on('connection', this.onConnection);

        this.networkLoop = new NetworkLoop();
        this.networkLoop.start();
    }

    close() {
        this.networkLoop.stop();
        this.server.close();
    }

    private onConnection = async (connection: ws) => {
        const timeoutTimer = setTimeout(() => {
            connection.close();
        }, 5000);

        connection.once('message', async (message: ws.Data) => {
            clearTimeout(timeoutTimer);

            const commandStream = new WebsocketCommandStream(connection);

            const result = await this.verifyClient(message);
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
        });
    };

    private async verifyClient(message: ws.Data): Promise<ErrorCode | User> {
        if (typeof message !== 'string') {
            return ErrorCode.INVALID_REQUEST;
        }
        let request;
        try {
            request = JSON.parse(message);
        } catch (e) {
            return ErrorCode.INVALID_REQUEST;
        }
        const { v, username, password } = request;

        if (v !== PROTOCOL_VERSION) {
            return ErrorCode.VERSION_MISMATCH;
        }
        if (typeof username !== 'string' || typeof password !== 'string') {
            return ErrorCode.INVALID_REQUEST;
        }

        const user = await this.dao.verifyUser(username as UserName, password as Password);
        if (user === null) {
            return ErrorCode.INVALID_CREDENTIALS;
        }

        return user;
    }
}
