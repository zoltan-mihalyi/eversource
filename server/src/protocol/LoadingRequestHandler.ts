import { ClientState } from './ClientState';
import { CharacterInfo } from '../../../common/domain/CharacterInfo';
import { PlayingRequestHandler } from './PlayingRequestHandler';
import { Zone } from '../world/Zone';
import { ObjectId } from '../../../common/GameObject';
import { CharacterEntity } from '../entity/CharacterEntity';

let nextId = 0;

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
            const id = nextId++ as ObjectId;
            const character = new CharacterEntity(id, position, this.data.appearance, this.data.equipment);
            zone.addEntity(character);

            this.context.sendCommand('ready', void 0);
            this.manager.enter(PlayingRequestHandler, { zone, character });
        });
    }

    handleExit() {
        this.token.cancelled = true;
    }
}
