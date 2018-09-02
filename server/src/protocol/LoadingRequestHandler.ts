import { ClientState } from './ClientState';
import { CharacterInfo } from '../../../common/domain/CharacterInfo';
import { PlayingRequestHandler } from './PlayingRequestHandler';

export class LoadingRequestHandler extends ClientState<CharacterInfo> {
    private token = { cancelled: false };
    private serverLoading = false;

    ready() {
        if (this.serverLoading) {
            return;
        }
        this.serverLoading = true;

        this.handlerManager.world.createObject(this.data.location, this.token, (object) => {
            this.handlerManager.sendMessage('ready', void 0);
            this.handlerManager.enterState(PlayingRequestHandler, object);
        });
    }

    handleExit() {
        this.token.cancelled = true;
    }
}
