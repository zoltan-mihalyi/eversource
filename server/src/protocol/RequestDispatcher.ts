import { RequestCommand, RequestTypes, ResponseCommand, ResponseTypes } from '../../../common/protocol/Messages';
import { ClientState, ClientStateContext, SendMessage } from './ClientState';
import { InitialClientState } from './InitialClientState';
import { UserDao } from '../dao/UserDao';
import { World } from '../world/World';
import { NetworkLoop } from '../NetworkLoop';
import { StateManager } from '../../../common/util/StateManager';

export class RequestDispatcher {
    private stateManager: StateManager<ClientState<any>, ClientStateContext>;

    constructor(readonly dao: UserDao, readonly world: World, readonly sendMessage: SendMessage, readonly networkLoop: NetworkLoop) {
        this.stateManager = StateManager.create({
            dao,
            sendMessage,
            world,
            networkLoop
        },InitialClientState, void 0)
    }

    isValidCommand(command: string): command is RequestCommand {
        return this.stateManager.getCurrentState().handler.hasOwnProperty(command);
    }

    handleRequest<T extends RequestCommand>(command: T, data: RequestTypes[T]): void {
        (this.stateManager.getCurrentState().handler[command] as (data: RequestTypes[T]) => void)(data);
    }

    handleExit() {
        this.stateManager.getCurrentState().handleExit();
    }
}
