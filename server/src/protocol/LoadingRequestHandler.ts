import { ClientState } from './ClientState';
import { CharacterInfo } from '../../../common/domain/CharacterInfo';
import { PlayingRequestHandler } from './PlayingRequestHandler';
import { Zone } from '../world/Zone';
import { GameObject, XPerSecond, YPerSecond } from '../../../common/GameObject';

export class LoadingRequestHandler extends ClientState<CharacterInfo> {
    private token = { cancelled: false };
    private serverLoading = false;

    ready() {
        if (this.serverLoading) {
            return;
        }
        this.serverLoading = true;

        const { zoneId, position } = this.data.location;

        this.context.world.getZone(zoneId, (zone: Zone) => {
            if (this.token.cancelled) {
                return;
            }
            const object: GameObject = {
                direction: 'D',
                type: 'character',
                position,
                speed: { x: 0 as XPerSecond, y: 0 as YPerSecond },
            };
            zone.addObject(object);

            this.context.sendCommand('ready', void 0);
            this.manager.enter(PlayingRequestHandler, { zone, object });
        });
    }

    handleExit() {
        this.token.cancelled = true;
    }
}
