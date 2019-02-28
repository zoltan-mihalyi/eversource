import * as PIXI from 'pixi.js';
import { EntityContainer } from '../../../../common/es/EntityContainer';
import { ClientComponents } from '../../es/ClientComponents';
import { PartialPick } from '../../../../common/util/Types';
import { Attitude, CreatureAttitude } from '../../../../common/components/CommonComponents';
import { Synchronizer } from '../Synchronizer';
import { EventBus } from '../../../../common/es/EventBus';
import { ClientEvents } from '../../es/ClientEvents';

const HP_BAR_WIDTH = 60;

const DEFAULT_ATTITUDE: Attitude = {
    value: CreatureAttitude.FRIENDLY,
};

class HealthBarSynchronizer extends Synchronizer<ClientComponents, 'display' | 'hp', PIXI.Graphics[]> {
    constructor() {
        super(['display', 'hp', 'attitude', 'player', 'playerControllable', 'mouseOver']);
    }

    getValue({ hp, attitude, player, mouseOver, playerControllable }: PartialPick<ClientComponents, 'display' | 'hp'>): PIXI.Graphics[] {
        if (!player && !mouseOver) {
            return [];
        }

        const hpGraphics = new PIXI.Graphics();
        hpGraphics.beginFill(0x555555);
        hpGraphics.drawRect(-HP_BAR_WIDTH / 2 - 1, -1, HP_BAR_WIDTH + 2, 4 + 2);

        hpGraphics.beginFill(0x000000);
        hpGraphics.drawRect(-HP_BAR_WIDTH / 2, 0, HP_BAR_WIDTH, 4);

        hpGraphics.beginFill(attitudeColor(playerControllable, attitude));
        hpGraphics.drawRect(-HP_BAR_WIDTH / 2, 0, hp.current / hp.max * HP_BAR_WIDTH, 4);

        return [hpGraphics];
    }

    getEmptyValue(): PIXI.Graphics[] {
        return [];
    }

    apply({ display }: PartialPick<ClientComponents, 'display' | 'hp'>, value: PIXI.Graphics[]): void {
        display.setContent('statusContainer', value)
    }
}

export function displayHealthBarSystem(container: EntityContainer<ClientComponents>, eventBus: EventBus<ClientEvents>) {
    const entities = container.createQuery('display', 'hp');

    new HealthBarSynchronizer().keepSync(entities, eventBus);
}

function attitudeColor(self?: boolean, attitude: Attitude = DEFAULT_ATTITUDE): number {
    if (self) {
        return 0x00CC2C; //TODO use common colors
    }
    switch (attitude.value) {
        case CreatureAttitude.FRIENDLY:
            return 0x6e96db;
        case CreatureAttitude.NEUTRAL:
            return 0xe1e000;
        case CreatureAttitude.HOSTILE:
            return 0xcc0000;
    }
}
