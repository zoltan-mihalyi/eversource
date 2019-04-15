import * as PIXI from 'pixi.js';
import { EntityContainer } from '../../../../common/es/EntityContainer';
import { ClientComponents } from '../../es/ClientComponents';
import { PartialPick } from '../../../../common/util/Types';
import { Attitude, CreatureAttitude } from '../../../../common/components/CommonComponents';
import { Synchronizer } from '../Synchronizer';
import { EventBus } from '../../../../common/es/EventBus';
import { ClientEvents } from '../../es/ClientEvents';
import { attitude } from '../../components/theme';
import { colorToNumber } from '../../utils';

const HP_BAR_WIDTH = 60;

const SELF = colorToNumber(attitude.self);
const FRIENDLY = colorToNumber(attitude.friendly);
const NEUTRAL = colorToNumber(attitude.neutral);
const HOSTILE = colorToNumber(attitude.hostile);

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
        return SELF;
    }
    switch (attitude.value) {
        case CreatureAttitude.FRIENDLY:
            return FRIENDLY;
        case CreatureAttitude.NEUTRAL:
            return NEUTRAL;
        case CreatureAttitude.HOSTILE:
            return HOSTILE;
    }
}
