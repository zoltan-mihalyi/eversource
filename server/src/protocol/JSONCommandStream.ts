import * as ws from 'ws';
import { CommandStream } from './CommandStream';
import { ResponseCommand, ResponseTypes } from '../../../common/protocol/Messages';
import { Connection } from './net/Connector';

export class JSONCommandStream implements CommandStream {
    onCommand: (command: string, data: string) => void = () => {
    };

    private pingMessage!: Buffer;
    private pingDate!: Date;
    private ping = 0;
    private pingTimeout!: NodeJS.Timer | null;

    constructor(private connection: Connection) {
        connection.on('message', this.onMessage);
        connection.on('pong', this.onPong);
        this.sendPing();

        connection.on('close', () => {
            if (this.pingTimeout !== null) {
                clearTimeout(this.pingTimeout);
            }
        });
    }

    sendCommand<T extends ResponseCommand>(command: T, data: ResponseTypes[T]): void {
        if (this.connection.readyState !== ws.OPEN) { // TODO
            return;
        }
        const suffix = data === void 0
            ? ''
            : ':' + JSON.stringify(data);

        this.connection.send(command + suffix);
    }

    canSend(): boolean {
        return this.connection.bufferedAmount === 0 && this.ping < 200;
    }

    private getPing() {
        if (this.pingTimeout !== null) {
            return Math.max(this.ping, new Date().getTime() - this.pingDate.getTime());
        }
    }

    private sendPing() {
        this.pingTimeout = null;
        const date = new Date();
        const pingMessage = date.getTime() + '';
        this.pingMessage = Buffer.from(pingMessage);
        this.pingDate = date;

        this.connection.ping(pingMessage);
    }

    private onPong = (data: Buffer) => {
        if (!data.equals(this.pingMessage)) {
            return;
        }
        this.ping = new Date().getTime() - this.pingDate.getTime();
        this.pingTimeout = setTimeout(() => this.sendPing(), 100);
    };

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