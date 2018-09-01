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
    };

    constructor(protected handlerManager: HandlerManager, protected data: T) {
    }

    handleExit() {
    }

    protected characters() {
    }

    protected enter(data: string) {
    }

    protected ready() {
    }

    protected leave() {
    }
}

export interface ClientStateConstructor<T> {
    new(stateManager: HandlerManager, data: T): ClientState<T>
}
