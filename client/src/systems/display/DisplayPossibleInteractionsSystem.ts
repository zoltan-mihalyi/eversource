import { EntityContainer } from '../../../../common/es/EntityContainer';
import { ClientComponents } from '../../es/ClientComponents';
import { PartialPick } from '../../../../common/util/Types';
import { TextureLoader } from '../../map/TextureLoader';
import { GOLDEN } from '../../display/Cursors';

export function displayPossibleInteractionsSystem(container: EntityContainer<ClientComponents>, textureLoader: TextureLoader) {
    const entities = container.createQuery('display', 'possibleInteractions');

    entities.on('add', updateInteractions);
    entities.on('update', updateInteractions);
    entities.on('remove', ({ display }) => {
        display.setContent('interactionContainer', []);
        display.spriteContainer.setInteractable(false);
        display.spriteContainer.cursor = '';
    });

    function updateInteractions({ display, possibleInteractions }: PartialPick<ClientComponents, 'display' | 'possibleInteractions'>) {
        const scale = 1 / possibleInteractions.length;
        const content = possibleInteractions.map((interaction, i) => {
            const q = textureLoader.createAnimatedSprite('misc', interaction);
            q.x = (i - (possibleInteractions.length - 1) / 2) * scale * 20;
            q.y = -scale * 6;
            q.scale.set(scale);
            return q;
        });

        display.setContent('interactionContainer', content);
        display.spriteContainer.setInteractable(true);
        display.spriteContainer.cursor = GOLDEN;
    }
}
