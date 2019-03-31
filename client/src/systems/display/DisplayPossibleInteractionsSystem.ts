import { EntityContainer } from '../../../../common/es/EntityContainer';
import { ClientComponents } from '../../es/ClientComponents';
import { PartialPick } from '../../../../common/util/Types';
import { TextureLoader } from '../../loader/TextureLoader';
import { GOLDEN } from '../../display/Cursors';
import { colorToNumber } from '../../utils';
import { black, brown } from '../../components/theme';
import { PossibleInteractions } from '../../../../common/components/NetworkComponents';

const FILL = colorToNumber(brown.lighter);
const BORDER = colorToNumber(brown.darkest);

export function displayPossibleInteractionsSystem(container: EntityContainer<ClientComponents>, textureLoader: TextureLoader) {
    const entities = container.createQuery('display', 'possibleInteractions');

    entities.on('add', updateInteractions);
    entities.on('update', updateInteractions);
    entities.on('remove', ({ display }) => {
        display.setContent('interactionContainer', []);
        display.spriteContainer.setInteractable(false);
        display.spriteContainer.cursor = '';
    });

    function createInteractionBubble(possibleInteractions: PossibleInteractions) {
        const scale = 1;
        const content = possibleInteractions
            .filter(interaction => interaction !== 'story')
            .map((interaction, i) => {
                const q = textureLoader.createAnimatedSprite('misc', interaction);
                q.x = (i - (possibleInteractions.length - 1) / 2) * scale * 20;
                q.y = -scale * 6 - 7;
                q.scale.set(scale);
                return q;
            });

        const border = new PIXI.Graphics();
        border.beginFill(FILL);
        border.lineStyle(2, BORDER, 1);

        const w = possibleInteractions.length * 12 + 1;
        const h = 30;
        const t = 4;

        border.moveTo(-w, -h);
        border.lineTo(w, -h);
        border.lineTo(w, -t);
        border.lineTo(w - 5, -t);
        border.lineTo(w - 5 - t, 0);
        border.lineTo(w - 5 - t, -t);
        border.lineTo(-w, -t);
        border.lineTo(-w, -h);
        border.endFill();

        if (content.length > 0) {
            border.addChild(content[0], ...content.slice(1));
        }
        return border;
    }

    function updateInteractions({ display, possibleInteractions }: PartialPick<ClientComponents, 'display' | 'possibleInteractions'>) {

        if (possibleInteractions[0] !== 'story') {
            const border = createInteractionBubble(possibleInteractions);
            display.setContent('interactionContainer', [border]);
        } else {
            display.setContent('interactionContainer', []);
        }
        display.spriteContainer.setInteractable(true);
        display.spriteContainer.cursor = GOLDEN;
    }
}
