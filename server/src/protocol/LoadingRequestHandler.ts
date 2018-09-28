import { ClientState } from './ClientState';
import { CharacterInfo } from '../../../common/domain/CharacterInfo';
import { PlayingRequestHandler } from './PlayingRequestHandler';
import { CharacterEntity } from '../entity/CharacterEntity';
import { CancellableProcess } from '../../../common/util/CancellableProcess';

export class LoadingRequestHandler extends ClientState<CharacterInfo> {
    private serverLoading = false;
    private process = new CancellableProcess();

    async ready() {
        if (this.serverLoading) {
            return;
        }
        this.serverLoading = true;

        const { zoneId, position } = this.data.location;

        const zone = await this.process.runPromise(this.context.world.getZone(zoneId));

        const character = new CharacterEntity(position, this.data.appearance, this.data.equipment);
        zone.addEntity(character);

        this.context.sendCommand('ready', void 0);
        this.manager.enter(PlayingRequestHandler, { zone, character });
    }

    handleExit() {
        this.process.stop();
    }
}
