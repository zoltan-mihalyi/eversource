import * as PIXI from 'pixi.js';
import { EntityContainer } from '../../../../common/es/EntityContainer';
import { ClientComponents } from '../../es/ClientComponents';
import { PartialPick } from '../../../../common/util/Types';
import { black, brown, player as playerColor } from '../../components/theme';
import { EventBus } from '../../../../common/es/EventBus';
import { ClientEvents } from '../../es/ClientEvents';
import { Synchronizer } from '../Synchronizer';

class DisplayNameSynchronizer extends Synchronizer<ClientComponents, 'display' | 'name', PIXI.DisplayObject[]> {
    constructor() {
        super(['name', 'level', 'player', 'mouseOver']);
    }

    getEmptyValue(): PIXI.DisplayObject[] {
        return [];
    }

    getValue({ name, level, player, mouseOver }: PartialPick<ClientComponents, 'display' | 'name'>): PIXI.DisplayObject[] {
        if (!player && !mouseOver) {
            return [];
        }

        const title = level ? `[${level.value}] ${name.value}` : name.value;

        const text = new PIXI.Text(title, {
            fontFamily: 'pixel, serif',
            fontSize: 32,
            fill: player ? playerColor : brown.lighter,
            stroke: black,
            strokeThickness: 1.4,
            align: 'left',
        });
        text.scale.set(0.5);
        text.x = -Math.floor(text.width / 2); // avoid blurry text

        return [text];
    }

    apply(components: PartialPick<ClientComponents, 'display' | 'name'>, value: PIXI.DisplayObject[]): void {
        components.display.setContent('textContainer', value);
    }
}

export function displayNameSystem(container: EntityContainer<ClientComponents>, eventBus: EventBus<ClientEvents>) {
    const entities = container.createQuery('display', 'name');

    new DisplayNameSynchronizer().keepSync(entities, eventBus);
}
