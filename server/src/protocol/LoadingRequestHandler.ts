import { ClientState } from './ClientState';
import { PlayingRequestHandler } from './PlayingRequestHandler';
import { CancellableProcess } from '../../../common/util/CancellableProcess';
import { BASE_HUMANOID, CreatureEntity } from '../entity/CreatureEntity';
import { PlayerController } from '../entity/controller/PlayerController';
import { CharacterDetails } from '../character/CharacterDetails';
import { HiddenPlayerInfo } from '../entity/Entity';

export class LoadingRequestHandler extends ClientState<CharacterDetails> {
    private serverLoading = false;
    private process = new CancellableProcess();

    async ready() {
        if (this.serverLoading) {
            return;
        }
        this.serverLoading = true;

        const { info } = this.data;

        const { name, location: { zoneId, position } } = info;

        const zone = await this.process.runPromise(this.context.world.getZone(zoneId));

        const controller = new PlayerController();
        const player: HiddenPlayerInfo = {
            state: {
                questLog: this.data.questLog,
            },
            details: this.data,
        };
        const hidden = { player, quests: [], questCompletions: [] };
        const character = new CreatureEntity({
            ...BASE_HUMANOID,
            position,
            name,
            player: true,
            hp: info.hp,
            scale: 1,
            appearance: info.appearance,
            equipment: info.equipment,
        }, hidden, controller);
        zone.addEntity(character);

        this.context.sendCommand('ready', void 0);
        this.manager.enter(PlayingRequestHandler, { zone, character, controller, hidden });
    }

    handleExit() {
        this.process.stop();
    }
}
