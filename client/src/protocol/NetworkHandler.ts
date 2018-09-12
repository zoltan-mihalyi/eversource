import { StateManager } from '../../../common/util/StateManager';
import { parseCommand } from '../utils';
import { ResponseCommand } from '../../../common/protocol/Messages';
import { NetworkingContext, NetworkingState } from './NetworkingState';
import { LoadingCharactersState } from './LoadingCharactersState';
import { Display } from './Display';

export class NetworkHandler {
    private st: StateManager<NetworkingState<any>, NetworkingContext>;

    constructor(ws: WebSocket, display: Display) {
        const context = {
            ws,
            display,
            closeConnection: () => {
                ws.onmessage = null;
                ws.onclose = null;
                ws.close();
            }
        };
        this.st = StateManager.create(context, LoadingCharactersState, void 0);

        ws.onmessage = this.onMessage;
        ws.onclose = this.onClose;
    }

    private onMessage = (evt: MessageEvent) => {
        const command = parseCommand(evt.data);

        const state = this.st.getCurrentState();
        (state[command.command as ResponseCommand] as (data: any) => void)(command.data)
    };

    private onClose = () => {
        this.st.getCurrentState().onClose();
    };
}