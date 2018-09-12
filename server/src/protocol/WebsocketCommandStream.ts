import * as ws from 'ws';
import { CommandStream } from './CommandStream';
import { ResponseCommand, ResponseTypes } from '../../../common/protocol/Messages';

export class WebsocketCommandStream implements CommandStream {
    onCommand: (command: string, data: string) => void = () => {
    };

    constructor(private connection: ws) {
        connection.on('message', this.onMessage);
    }

    sendCommand<T extends ResponseCommand>(command: T, data: ResponseTypes[T]): void {
        if (this.connection.readyState !== ws.OPEN) {
            return;
        }
        const suffix = data === void 0
            ? ''
            : ':' + JSON.stringify(data);

        this.connection.send(command + suffix);
    }

    private onMessage = (message: ws.Data) => {
        if (typeof message !== 'string') {
            return;
        }
        const commandEnd = message.indexOf(':');
        const command = commandEnd === -1 ? message : message.substring(0, commandEnd);
        const data = commandEnd === -1 ? '' : message.substring(commandEnd + 1);
        this.onCommand(command, data);
    }
}