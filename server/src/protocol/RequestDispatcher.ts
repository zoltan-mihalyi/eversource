import { RequestCommand, RequestTypes, ResponseCommand, ResponseTypes } from '../../../common/protocol/Messages';
import { ClientState, ClientStateConstructor } from './ClientState';
import { InitialClientState } from './InitialClientState';
import { UserDao } from '../dao/UserDao';
import { World } from '../world/World';
import { NetworkLoop } from '../NetworkLoop';

type SendMessage = <T extends ResponseCommand>(command: T, data: ResponseTypes[T], unreliable?: boolean) => void;

export interface HandlerManager {
    readonly dao: UserDao;
    readonly world: World;
    readonly sendMessage: SendMessage;
    readonly networkLoop: NetworkLoop;

    enterState<T>(stateConstructor: ClientStateConstructor<T>, data: T): void;
}

export class RequestDispatcher implements HandlerManager {
    private state: ClientState<any> = this.instantiateState(InitialClientState, void 0);

    constructor(readonly dao: UserDao, readonly world: World, readonly sendMessage: SendMessage, readonly networkLoop: NetworkLoop) {
    }

    isValidCommand(command: string): command is RequestCommand {
        return this.state.handler.hasOwnProperty(command);
    }

    handleRequest<T extends RequestCommand>(command: T, data: RequestTypes[T]): void {
        (this.state.handler[command] as (data: RequestTypes[T]) => void)(data);
    }

    handleExit() {
        this.state.handleExit();
    }

    enterState<T>(stateConstructor: ClientStateConstructor<T>, data: T): void {
        this.state = this.instantiateState(stateConstructor, data);
        this.state.onEnter();
    }

    private instantiateState<T>(constructor: ClientStateConstructor<T>, data: T): ClientState<T> {
        return new constructor(this, data);
    }
}
