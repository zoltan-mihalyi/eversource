import { ClientState } from './ClientState';
import { InitialClientState } from './InitialClientState';
import { GameObject } from '../../../common/GameObject';
import { Zone } from '../world/Zone';

export interface WorldObject {
    zone: Zone;
    object: GameObject;
}

export class PlayingRequestHandler extends ClientState<WorldObject> {
    leave() {
        this.cleanup();
        this.handlerManager.enterState(InitialClientState, void 0);
    }

    handleExit() {
        this.cleanup();
    }

    private cleanup() {
        const { zone, object } = this.data;

        zone.removeObject(object);
    }
}