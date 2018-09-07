import { ClientState } from './ClientState';
import { CharacterInfo } from '../../../common/domain/CharacterInfo';
import { PlayingRequestHandler } from './PlayingRequestHandler';
import { Zone } from '../world/Zone';
import { GameObject } from '../../../common/GameObject';

export class LoadingRequestHandler extends ClientState<CharacterInfo> {
    private token = { cancelled: false };
    private serverLoading = false;

    ready() {
        if (this.serverLoading) {
            return;
        }
        this.serverLoading = true;

        const { zoneId, x, y } = this.data.location;

        this.handlerManager.world.getZone(zoneId, (zone: Zone) => {
            if (this.token.cancelled) {
                return;
            }
            const object: GameObject = {
                direction: 'D',
                type: 'character',
                x,
                y,
            };
            zone.addObject(object);

            this.handlerManager.sendMessage('ready', void 0);
            this.handlerManager.enterState(PlayingRequestHandler, { zone, object });
        });
    }

    handleExit() {
        this.token.cancelled = true;
    }
}
