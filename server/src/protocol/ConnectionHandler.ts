import { StateManager } from '../../../common/util/StateManager';
import { ClientState, ClientStateContext } from './ClientState';
import { UserDao } from '../dao/UserDao';
import { World } from '../world/World';
import { NetworkLoop } from '../NetworkLoop';
import { InitialClientState } from './InitialClientState';
import { ResponseCommand, ResponseTypes } from '../../../common/protocol/Messages';
import { CommandStream } from './CommandStream';

export class ConnectionHandler {
    private stateManager: StateManager<ClientState<any>, ClientStateContext>;

    constructor(dao: UserDao, world: World, networkLoop: NetworkLoop, private commandStream: CommandStream) {
        this.stateManager = StateManager.create({
            dao,
            world,
            networkLoop,
            sendCommand: this.sendCommand,
        }, InitialClientState, void 0);

        commandStream.onCommand = this.onCommand;
    }

    close() {
        this.stateManager.getCurrentState().handleExit();
    }

    private sendCommand = <T extends ResponseCommand>(command: T, data: ResponseTypes[T]) => {
        this.commandStream.sendCommand(command, data);
    };

    private onCommand = (command: string, data: string) => {
        const clientState = this.stateManager.getCurrentState();

        if (!clientState.isValidCommand(command)) {
            return;
        }

        (clientState.handler[command] as (data: string) => void)(data);
    };
}