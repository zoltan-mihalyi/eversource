import { ClientState } from './ClientState';
import { CharacterInfo } from '../../../common/domain/CharacterInfo';
import { PlayingRequestHandler } from './PlayingRequestHandler';

export class LoadingRequestHandler extends ClientState<CharacterInfo> {
    ready() {
        const object = this.handlerManager.world.createObject();
        this.handlerManager.enterState(PlayingRequestHandler, object);
    }
}