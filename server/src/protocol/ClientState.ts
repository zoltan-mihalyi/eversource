import { RequestCommand, RequestTypes, ResponseCommand, ResponseTypes } from '../../../common/protocol/Messages';
import { State, StateManager } from '../../../common/util/StateManager';
import { UserDao } from '../dao/UserDao';
import { World } from '../world/World';
import { NetworkLoop } from '../NetworkLoop';

export type RequestHandler = {
    [P in RequestCommand]: (data: RequestTypes[P]) => void;
}

export type SendMessage = <T extends ResponseCommand>(command: T, data: ResponseTypes[T]) => void;

export interface ClientStateContext {
    readonly dao: UserDao;
    readonly world: World;
    readonly sendMessage: SendMessage;
    readonly networkLoop: NetworkLoop;
}

export class ClientState<T> extends State<ClientStateContext, T> {
    readonly handler: RequestHandler = {
        characters: () => this.characters(),
        enter: (data: string) => this.enter(data),
        ready: () => this.ready(),
        leave: () => this.leave(),
        command: (data: string) => this.command(data),
    };

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

    protected command(data: string) {
    }
}
