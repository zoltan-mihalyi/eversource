import { ClientState } from './ClientState';
import { Zone } from '../world/Zone';
import { CharacterSelectionRequestHandler } from './CharacterSelectionRequestHandler';
import { CharacterEntity } from '../entity/CharacterEntity';

export interface PlayerData {
    zone: Zone;
    character: CharacterEntity;
}

export class PlayingRequestHandler extends ClientState<PlayerData> {
    leave() {
        this.cleanup();
        this.manager.enter(CharacterSelectionRequestHandler, void 0);
    }

    command(data: string) {
        const separatorIndex = data.indexOf(':');
        const command = separatorIndex === -1 ? data : data.substring(0, separatorIndex); // todo duplicate
        const params = separatorIndex === -1 ? '' : data.substring(separatorIndex + 1);

        switch (command) {
            case 'move': {
                const split = params.split(',');
                if (split.length !== 2) {
                    return;
                }
                let sX = parseFloat(split[0]);
                let sY = parseFloat(split[1]);
                if (!validNumber(sX) || !validNumber(sY)) {
                    return;
                }
                const len = Math.sqrt(sX * sX + sY * sY);
                if (len > 1) {
                    sX /= len;
                    sY /= len;
                }
                this.data.character.setMoving(sX, sY);
            }
        }

    }

    onEnter() {
        this.context.networkLoop.add(this.networkUpdate);
    }

    handleExit() {
        this.cleanup();
    }

    private cleanup() {
        const { zone, character } = this.data;

        this.context.networkLoop.remove(this.networkUpdate);
        zone.removeEntity(character);
    }

    private networkUpdate = () => {
        const { character, zone } = this.data;

        this.context.sendCommand('state', {
            character: character.toGameObject(),
            others: zone.query(character).map(e => e.toGameObject()),
        });
    };
}

function validNumber(num: number): boolean {
    return !isNaN(num) && isFinite(num);
}
