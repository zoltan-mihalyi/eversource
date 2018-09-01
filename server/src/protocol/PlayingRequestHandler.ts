import { ClientState } from './ClientState';
import { InitialClientState } from './InitialClientState';
import { WorldObject } from '../world/World';

export class PlayingRequestHandler extends ClientState<WorldObject> {
    leave() {
        this.cleanup();
        this.handlerManager.enterState(InitialClientState, void 0);
    }

    handleExit() {
        this.cleanup();
    }

    private cleanup() {
        this.handlerManager.world.removeObject(this.data);
    }
}