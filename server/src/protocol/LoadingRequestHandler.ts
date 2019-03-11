import { ClientState } from './ClientState';
import { PlayingRequestHandler } from './PlayingRequestHandler';
import { CancellableProcess } from '../../../common/util/CancellableProcess';
import { hpForLevel } from '../../../common/algorithms';
import { CharacterDetails } from '../character/CharacterDetails';
import { CreatureAttitude } from '../../../common/components/CommonComponents';
import { CharacterInventory } from '../character/CharacterInventory';

export class LoadingRequestHandler extends ClientState<CharacterDetails> {
    private serverLoading = false;
    private process = new CancellableProcess();

    async ready() {
        if (this.serverLoading) {
            return;
        }
        this.serverLoading = true;

        const { info, items } = this.data;

        const { name, location: { zoneId, position } } = info;

        const { world } = this.context;
        const zone = await this.process.runPromise(world.getZone(zoneId));

        const entity = zone.createEntity({
            level: { value: info.level },
            xp: { value: info.xp },
            position,
            name: { value: name },
            player: true,
            speed: {
                walking: 2,
                running: 4,
            },
            quests: {
                questLog: this.data.questLog,
                questsDone: this.data.questsDone,
            },
            hp: {
                max: hpForLevel(info.level),
                current: info.hp,
            },
            scale: { value: 1 },
            activity: 'standing',
            direction: 'down',
            view: {
                type: 'humanoid',
                appearance: info.appearance,
                equipment: info.equipment,
            },
            attitude: {
                value: CreatureAttitude.FRIENDLY,
            },
            weapon: {
                damage: 1,
            },
            chatListener: {
                onChatMessage: message => this.context.sendCommand('chatMessage', message),
            },
            inventory: new CharacterInventory(world.items, items)
        });

        this.context.sendCommand('ready', void 0);
        this.manager.enter(PlayingRequestHandler, { zone, entity, characterInfo: info });
    }

    handleExit() {
        this.process.stop();
    }
}
