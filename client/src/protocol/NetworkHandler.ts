import { StateManager } from '../../../common/util/StateManager';
import { parseCommand } from '../utils';
import { ResponseCommand } from '../../../common/protocol/Messages';
import { ConnectingState } from './ConnectingState';
import { Display } from './Display';
import { WebRTCServerConnection } from '../webrtc/WebRTCServerConnection';

export function connect(display: Display, url: string, username: string, password: string) {
    // const connection = new WebSocket(`ws://${url}`);
    const connection = new WebRTCServerConnection(`http://${url}`);

    const context = {
        connection,
        display,
        closeConnection: () => {
            connection.onmessage = null;
            connection.onclose = null;
            connection.close();
        }
    };

    const stateManager = StateManager.create(context, ConnectingState, { username, password });

    connection.onopen = () => {
        stateManager.getCurrentState().onOpen();
    };

    connection.onmessage = (evt) => {
        const command = parseCommand(evt.data);

        const state = stateManager.getCurrentState();
        (state[command.command as ResponseCommand] as (data: any) => void)(command.data)
    };

    connection.onclose = () => {
        stateManager.getCurrentState().onClose();
    };
}