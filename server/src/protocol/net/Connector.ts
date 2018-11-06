export type MessageData = string | Buffer | ArrayBuffer | Buffer[]

export interface Connection {
    bufferedAmount: number;
    readyState: number;

    close(): void;

    send(data: string): void;

    ping(data: MessageData): void;

    on(event: 'message', cb: (data: MessageData) => void): void;

    on(event: 'pong', cb: (data: Buffer) => void): void;

    on(event: 'close', cb: () => void): void;

    once(event: 'message', cb: (data: MessageData) => void): void;

    once(event: string, cb: (data: any) => void): void;
}

export interface Connector {
    on(event: 'connection', cb: (connection: Connection) => void): void;

    close(): void;
}