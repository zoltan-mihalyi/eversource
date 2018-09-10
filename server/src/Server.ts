import * as ws from 'ws';
import { RequestDispatcher } from './protocol/RequestDispatcher';
import { PROTOCOL_VERSION, ResponseCommand, ResponseTypes } from '../../common/protocol/Messages';
import { UserDao } from './dao/UserDao';
import { World } from './world/World';
import { NetworkLoop } from './NetworkLoop';
import * as url from 'url';
import * as http from 'http';
import { Dao, Password, User, UserName } from './dao/Dao';
import { ErrorCode } from '../../common/protocol/ErrorCode';
import WebSocket = require('ws');

class ConnectionHandler {
    private dispatcher: RequestDispatcher;

    constructor(dao: UserDao, world: World, networkLoop: NetworkLoop, private connection: ws) {
        this.dispatcher = new RequestDispatcher(dao, world, this.sendMessage, networkLoop);

        connection.on('message', this.onMessage);
    }

    close() {
        this.dispatcher.handleExit();
    }

    private sendMessage = <T extends ResponseCommand>(command: T, data: ResponseTypes[T]) => {
        sendMessage(this.connection, command, data);
    };

    private onMessage = (message: ws.Data) => {
        if (typeof message !== 'string') {
            return;
        }
        const commandEnd = message.indexOf(':');
        const command = commandEnd === -1 ? message : message.substring(0, commandEnd);
        if (!this.dispatcher.isValidCommand(command)) {
            return;
        }
        const data = commandEnd === -1 ? '' : message.substring(commandEnd + 1);

        this.dispatcher.handleRequest(command, data);
    };
}

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
        const result = await this.verifyClient(request);
        if (typeof result === 'number') {
            sendMessage(connection, 'error', result);
            connection.close();
            return;
        }

        console.log(`User connected! Playing: ${this.server.clients.size}`);

        const userDao = this.dao.getUserDao(result);

        const handler = new ConnectionHandler(userDao, this.world, this.networkLoop, connection);
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

function sendMessage<T extends ResponseCommand>(ws: WebSocket, command: T, data: ResponseTypes[T]) {
    if (ws.readyState !== ws.OPEN) {
        return;
    }
    const suffix = data === void 0
        ? ''
        : ':' + JSON.stringify(data);

    ws.send(command + suffix);
}
