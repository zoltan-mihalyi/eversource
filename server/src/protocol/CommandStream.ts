import { ResponseCommand, ResponseTypes } from '../../../common/protocol/Messages';

export interface CommandStream {
    sendCommand<T extends ResponseCommand>(command: T, data: ResponseTypes[T]): void;

    canSend(): boolean;

    onCommand: (command: string, data: string) => void;
}