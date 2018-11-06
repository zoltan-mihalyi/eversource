import * as ws from 'ws';
import { PROTOCOL_VERSION } from '../../common/protocol/Messages';
import { World } from './world/World';
import { NetworkLoop } from './NetworkLoop';
import { Dao, Password, User, UserName } from './dao/Dao';
import { ErrorCode } from '../../common/protocol/ErrorCode';
import { JSONCommandStream } from './protocol/JSONCommandStream';
import { ConnectionHandler } from './protocol/ConnectionHandler';
import { Connection, Connector } from './protocol/net/Connector';

export class Server {
    private readonly networkLoop: NetworkLoop;
    private users: number = 0;
    private connectors:Connector[] = [];

    constructor(private dao: Dao, private world: World ) {
        this.networkLoop = new NetworkLoop();
        this.networkLoop.start();
    }

    close() {
        this.networkLoop.stop();
        for (const connector of this.connectors) {
            connector.close();
        }
    }

    addConnector(connector:Connector){
        this.connectors.push(connector);
        connector.on('connection', this.onConnection);
    }

    private onConnection = async (connection: Connection) => {
        const timeoutTimer = setTimeout(() => {
            connection.close();
        }, 5000);

        connection.once('message', async (message: ws.Data) => {
            clearTimeout(timeoutTimer);

            const commandStream = new JSONCommandStream(connection);

            const result = await this.verifyClient(message);
            if (typeof result === 'number') {
                commandStream.sendCommand('error', result);
                connection.close();
                return;
            }

            this.users++;
            console.log(`User connected! Playing: ${this.users}`);

            const userDao = this.dao.getUserDao(result);

            const handler = new ConnectionHandler(userDao, this.world, this.networkLoop, commandStream);
            connection.on('close', () => {
                this.users--;
                console.log(`User disconnected! Playing: ${this.users}`);
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
