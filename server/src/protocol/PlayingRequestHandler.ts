import { ClientState } from './ClientState';
import { InitialClientState } from './InitialClientState';
import { Direction, GameObject, XPerSecond, YPerSecond } from '../../../common/GameObject';
import { Zone } from '../world/Zone';

export interface PlayerData {
    zone: Zone;
    object: GameObject;
}

export class PlayingRequestHandler extends ClientState<PlayerData> {
    leave() {
        this.cleanup();
        this.manager.enter(InitialClientState, void 0);
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

                let direction: Direction | null = null;
                const xLarger = Math.abs(sX) > Math.abs(sY);
                if (xLarger) {
                    direction = sX > 0 ? 'R' : 'L';
                } else if (sY < 0) {
                    direction = 'U';
                } else if (sY > 0) {
                    direction = 'D';
                }

                const { object } = this.data;
                if (direction) {
                    object.direction = direction;
                }
                object.speed = { x: sX * 4 as XPerSecond, y: sY * 4 as YPerSecond };
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
        const { zone, object } = this.data;

        this.context.networkLoop.remove(this.networkUpdate);
        zone.removeObject(object);
    }

    private networkUpdate = () => {
        const { object, zone } = this.data;

        this.context.sendCommand('state', {
            character: object,
            others: zone.query(object),
        });
    };
}

function validNumber(num: number): boolean {
    return !isNaN(num) && isFinite(num);
}
