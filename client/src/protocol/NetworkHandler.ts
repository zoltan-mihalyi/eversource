import { StateManager } from '../../../common/util/StateManager';
import { parseCommand } from '../utils';
import { ResponseCommand } from '../../../common/protocol/Messages';
import { ConnectingState } from './ConnectingState';
import { Display } from './Display';

export function connect(display: Display, wsUri: string, username: string, password: string) {
    const ws = new WebSocket(wsUri);

    const context = {
        ws,
        display,
        closeConnection: () => {
            ws.onmessage = null;
            ws.onclose = null;
            ws.close();
        }
    };

    const stateManager = StateManager.create(context, ConnectingState, { username, password });

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
}