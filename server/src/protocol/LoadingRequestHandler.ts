import { ClientState } from './ClientState';
import { CharacterInfo } from '../../../common/domain/CharacterInfo';
import { PlayingRequestHandler } from './PlayingRequestHandler';
import { CancellableProcess } from '../../../common/util/CancellableProcess';
import { BASE_HUMANOID, CreatureEntity } from '../entity/CreatureEntity';
import { PlayerController } from '../entity/controller/PlayerController';

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

        const controller = new PlayerController();
        const character = new CreatureEntity({
            ...BASE_HUMANOID,
            position,
            player: true,
            appearance: this.data.appearance,
            equipment: this.data.equipment,
        }, controller);
        zone.addEntity(character);

        this.context.sendCommand('ready', void 0);
        this.manager.enter(PlayingRequestHandler, { zone, character, controller });
    }

    handleExit() {
        this.process.stop();
    }
}
