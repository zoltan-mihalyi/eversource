import { RequestCommand, RequestTypes } from '../../../common/protocol/Messages';
import { HandlerManager } from './RequestDispatcher';

export type RequestHandler = {
    [P in RequestCommand]: (data: RequestTypes[P]) => void;
}

export class ClientState<T> {
    readonly handler: RequestHandler = {
        characters: () => this.characters(),
        enter: (data: string) => this.enter(data),
        ready: () => this.ready(),
        leave: () => this.leave(),
        command: (data:string) => this.command(data),
    };

    constructor(protected handlerManager: HandlerManager, protected data: T) {
    }

    handleExit() {
    }

    onEnter() {

    }

    protected characters() {
    }

    protected enter(data: string) {
    }

    protected ready() {
    }

    protected leave() {
    }

    protected command(data: string) {
    }
}

export interface ClientStateConstructor<T> {
    new(stateManager: HandlerManager, data: T): ClientState<T>
}
