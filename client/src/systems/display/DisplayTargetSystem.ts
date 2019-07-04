import { EntityContainer } from '../../../../common/es/EntityContainer';
import { ClientComponents } from '../../es/ClientComponents';
import { EventBus } from '../../../../common/es/EventBus';
import { ClientEvents } from '../../es/ClientEvents';
import { Entity } from '../../../../common/es/Entity';
import { TextureLoader } from '../../loader/TextureLoader';

export function displayTargetSystem(container: EntityContainer<ClientComponents>, eventBus: EventBus<ClientEvents>,
                                    textureLoader: TextureLoader) {

    const playerEntities = container.createQuery('playerControllable');

    let targetedEntities = new Set<Entity<ClientComponents>>();
    eventBus.on('render', () => {
        const newTargetedEntities = new Set<Entity<ClientComponents>>();

        playerEntities.forEach(({ target }) => {
            if (!target) {
                return;
            }
            const targetEntity = container.getEntity(target.entityId);
            if (!targetEntity) {
                return;
            }
            newTargetedEntities.add(targetEntity);
        });

        targetedEntities.forEach((entity) => {
            if (!newTargetedEntities.has(entity)) {
                removeTargetMark(entity);
            }
        });
        targetedEntities = newTargetedEntities;
        targetedEntities.forEach(updateTargetMark);
    });

    function updateTargetMark(entity: Entity<ClientComponents>) {
        const { display } = entity.components;

        let targetMark = entity.components.targetMark;
        if (!targetMark) {
            const animatedSprite = textureLoader.createAnimatedSprite('fx/target', 'target');
            animatedSprite.animationSpeed = 0;
            targetMark = animatedSprite;
            entity.set('targetMark', targetMark);
        }
        if (!display || display.animationEffectBg.children.indexOf(targetMark) !== -1) {
            return;
        }
        display.animationEffectBg.addChild(targetMark);
    }
}

function removeTargetMark(entity: Entity<ClientComponents>) {
    const { display, targetMark } = entity.components;

    if (!targetMark) {
        return;
    }

    entity.unset('targetMark');
    if (!display) {
        return;
    }
    display.animationEffectBg.removeChild(targetMark);
}