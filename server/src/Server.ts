import * as ws from 'ws';
import { RequestDispatcher } from './protocol/RequestDispatcher';
import { ResponseCommand, ResponseTypes } from '../../common/protocol/Messages';
import { UserDao } from './dao/UserDao';
import { World } from './world/World';
import { NetworkLoop } from './NetworkLoop';

class ConnectionHandler {
    private dispatcher: RequestDispatcher;

    private sendMessage = <T extends ResponseCommand>(command: T, data: ResponseTypes[T]) => {
        if (this.connection.readyState !== this.connection.OPEN) {
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


export class Server {
    private readonly server: ws.Server;
    private readonly networkLoop: NetworkLoop;

    constructor(daoProvider: (connection: ws) => UserDao | null, world: World, port: number) {
        this.server = new ws.Server({
            port,
        });

        this.networkLoop = new NetworkLoop();
        this.networkLoop.start();

        this.server.on('connection', (connection: ws) => {
            console.log('User connected!');

            const userDao = daoProvider(connection);
            if (!userDao) {
                connection.close();
                return;
            }

            const handler = new ConnectionHandler(userDao, world, this.networkLoop, connection);
            connection.on('close', () => {
                console.log('User disconnected!');
                handler.close();
            });
        });
    }

    close() {
        this.networkLoop.stop();
        this.server.close();
    }
}