import * as ws from 'ws';
import { VerifyClientCallbackAsync } from 'ws';
import { RequestDispatcher } from './protocol/RequestDispatcher';
import { PROTOCOL_VERSION, ResponseCommand, ResponseTypes } from '../../common/protocol/Messages';
import { UserDao } from './dao/UserDao';
import { World } from './world/World';
import { NetworkLoop } from './NetworkLoop';
import * as url from 'url';
import * as http from 'http';
import * as net from 'net';
import { Dao, Password, User, UserName } from './dao/Dao';

interface RequestInfo {
    origin: string;
    secure: boolean;
    req: http.IncomingMessage;
}

class ConnectionHandler {
    private dispatcher: RequestDispatcher;

    private sendMessage = <T extends ResponseCommand>(command: T, data: ResponseTypes[T], unreliable?: boolean) => {
        if (this.connection.readyState !== this.connection.OPEN) {
            return;
        }

        if (unreliable && this.connection.bufferedAmount > 0) {
            return;
        }

        const suffix = data === void 0
            ? ''
            : ':' + JSON.stringify(data);

        this.connection.send(command + suffix);
    };

    constructor(dao: UserDao, world: World, networkLoop: NetworkLoop, private connection: ws) {
        this.dispatcher = new RequestDispatcher(dao, world, this.sendMessage, networkLoop);

        connection.on('message', (message) => {
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
        });
    }

    close() {
        this.dispatcher.handleExit();
    }
}

const userRequestMap = new WeakMap<http.IncomingMessage, User>();

export class Server {
    private readonly server: ws.Server;
    private readonly networkLoop: NetworkLoop;

    constructor(private dao: Dao, world: World, port: number) {
        this.server = new ws.Server({
            port,
            verifyClient: (info, callback) => {
                this.verifyClient(info).then((params) => callback(...params));
            },
        });

        this.networkLoop = new NetworkLoop();
        this.networkLoop.start();

        this.server.on('connection', (connection: ws, request: http.IncomingMessage) => {
            console.log(`User connected! Playing: ${this.server.clients.size}`);

            const userDao = this.dao.getUserDao(userRequestMap.get(request)!);

            const handler = new ConnectionHandler(userDao, world, this.networkLoop, connection);
            connection.on('close', () => {
                console.log(`User disconnected! Playing: ${this.server.clients.size}`);
                handler.close();
            });
        });
    }

    close() {
        this.networkLoop.stop();
        this.server.close();
    }

    private verifyClient = async (info: RequestInfo): Promise<[boolean, number?, string?]> => {
        const queryParams = url.parse(info.req.url!, true).query;
        const { v, username, password } = queryParams;
        if (v !== PROTOCOL_VERSION.toString()) {
            return [false, 418, 'Version mismatch'];
        }
        if (typeof username !== 'string' || typeof password !== 'string') {
            return [false, 400, 'Missing username/password'];
        }

        const user = await this.dao.verifyUser(username as UserName, password as Password);
        if (user === null) {
            return [false, 403, 'Invalid credentials'];
        }
        userRequestMap.set(info.req, user);

        return [true];
    }
}