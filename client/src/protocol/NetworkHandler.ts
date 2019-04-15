import { StateManager } from '../../../common/util/StateManager';
import { parseCommand } from '../utils';
import { ResponseCommand } from '../../../common/protocol/Messages';
import { ConnectingData, ConnectingState } from './ConnectingState';
import { Display } from './Display';
import { NetworkingContext, NetworkingState } from './NetworkingState';

export function connect(display: Display, wsUri: string, username: string, password: string, onClose: () => void): StateManager<NetworkingState<any>, NetworkingContext> {
    const ws = new WebSocket(wsUri);

    const context: NetworkingContext = {
        ws,
        display,
        closeConnection: () => {
            ws.onmessage = null;
            ws.onclose = null;
            ws.close();
            onClose();
        }
    };

    const connectingData = {
        username,
        password
    };
    const stateManager = StateManager.create<NetworkingState<any>, NetworkingContext, ConnectingData>(context, ConnectingState, connectingData);

    ws.onopen = () => {
        stateManager.getCurrentState().onOpen();
    };

    ws.onmessage = (evt) => {
        const command = parseCommand(evt.data);

        const state = stateManager.getCurrentState();
        (state[command.command as ResponseCommand] as (data: any) => void)(command.data)
    };

    ws.onclose = () => {
        stateManager.getCurrentState().onClose();
    };

    return stateManager;
}
