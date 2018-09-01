import { ClientState } from './ClientState';
import { CharacterInfo } from '../../../common/domain/CharacterInfo';
import { PlayingRequestHandler } from './PlayingRequestHandler';

export class LoadingRequestHandler extends ClientState<CharacterInfo> {
    ready() {
        const object = this.handlerManager.world.createObject();
        this.handlerManager.sendMessage('ready', void 0);
        this.handlerManager.enterState(PlayingRequestHandler, object);
    }
}