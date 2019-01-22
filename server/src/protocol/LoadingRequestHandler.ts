import { ClientState } from './ClientState';
import { PlayingRequestHandler } from './PlayingRequestHandler';
import { CancellableProcess } from '../../../common/util/CancellableProcess';
import { BASE_HUMANOID, CreatureEntity, HiddenCreatureEntityData } from '../entity/CreatureEntity';
import { PlayerController } from '../entity/controller/PlayerController';
import { CharacterDetails } from '../character/CharacterDetails';
import { PlayerEntityOwner } from '../entity/EntityOwner';
import { hpForLevel } from '../../../common/algorithms';

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
        const owner = new PlayerEntityOwner(zone, this.data);
        const hidden: HiddenCreatureEntityData = { name: 'player', story: '', quests: [], questCompletions: [] };
        const character = new CreatureEntity(owner, {
            ...BASE_HUMANOID,
            level: info.level,
            position,
            name,
            player: true,
            hp: info.hp,
            maxHp: hpForLevel(info.level),
            scale: 1,
            appearance: info.appearance,
            equipment: info.equipment,
        }, hidden, controller);
        owner.setEntity(character);
        zone.addEntity(character);

        this.context.sendCommand('ready', void 0);
        this.manager.enter(PlayingRequestHandler, { zone, character, controller, owner });
    }

    handleExit() {
        this.process.stop();
    }
}
