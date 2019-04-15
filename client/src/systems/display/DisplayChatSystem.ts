import * as PIXI from 'pixi.js';
import { EntityContainer } from '../../../../common/es/EntityContainer';
import { ClientComponents } from '../../es/ClientComponents';
import { EventBus } from '../../../../common/es/EventBus';
import { ClientEvents } from '../../es/ClientEvents';
import { PartialPick } from '../../../../common/util/Types';
import { brown } from '../../components/theme';
import { colorToNumber } from '../../utils';
import { Metric } from './Metric';

const CHAT_TIMEOUT = 4000;
const PADDING = 4;

const LIGHTEST = colorToNumber(brown.normal);
const DARKEST = colorToNumber(brown.darkest);

export function displayChatSystem(container: EntityContainer<ClientComponents>, eventBus: EventBus<ClientEvents>, metric: Metric) {
    const entities = container.createQuery('chatMessageDisplay');

    const entitiesWithDisplay = container.createQuery('display', 'chatMessageDisplay');

    entitiesWithDisplay.on('add', updateChatMessageDisplay);
    entitiesWithDisplay.on('update', updateChatMessageDisplay);
    entitiesWithDisplay.on('remove', ({ display }) => {
        display.setContent('chatContainer', []);
    });

    function updateChatMessageDisplay({ display, chatMessageDisplay }: PartialPick<ClientComponents, 'display' | 'chatMessageDisplay'>) {
        const text = new PIXI.Text(chatMessageDisplay.text, {
            fontFamily: 'helvetica, arial, serif',
            fontSize: 16 * (window.devicePixelRatio || 1), // todo
            wordWrap: true,
            wordWrapWidth: 480,
            breakWords: true,
            fill: brown.lightest,
            align: 'left',
        });
        text.scale.set(1 / metric.scale);
        text.x = -Math.floor(text.width / 2); // avoid blurry text
        text.y = +text.style.fontSize / 2;

        const bg = new PIXI.Graphics();
        bg.lineStyle(1, LIGHTEST, 0.75);

        bg.beginFill(DARKEST, 0.75);
        bg.drawRoundedRect(text.x - PADDING, text.y - PADDING, text.width + PADDING * 2, text.height + PADDING * 2, 4);

        display.setContent('chatContainer', [bg, text])
    }

    eventBus.on('chatMessage', ({ entityId, text }) => {
        if (!entityId) {
            return;
        }

        const entity = container.getEntity(entityId);
        if (!entity) {
            return;
        }

        entity.set('chatMessageDisplay', {
            createdAt: new Date(),
            text,
        });
    });

    eventBus.on('render', () => {
        const time = new Date().getTime();

        entities.forEach(({ chatMessageDisplay }, entity) => {
            const timeout = chatMessageDisplay.createdAt.getTime() + CHAT_TIMEOUT + chatMessageDisplay.text.length * 40;

            if (timeout < time) {
                entity.unset('chatMessageDisplay');
            }
        });
    })
}
