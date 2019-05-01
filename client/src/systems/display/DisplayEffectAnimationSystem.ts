import { EntityContainer } from '../../../../common/es/EntityContainer';
import { ClientComponents } from '../../es/ClientComponents';
import { PartialPick } from '../../../../common/util/Types';
import { textureLoader } from '../../../stories/SampleData';
import { EntityDisplay } from '../../display/EntityDisplay';
import { EventBus } from '../../../../common/es/EventBus';
import { ClientEvents } from '../../es/ClientEvents';
import { EffectAnimation } from '../../../../common/components/CommonComponents';
import AnimatedSprite = PIXI.extras.AnimatedSprite;

interface AnimationSpriteMapping {
    [animation: string]: AnimatedSprite | undefined;
}

export function displayEffectAnimationSystem(entityContainer: EntityContainer<ClientComponents>, eventBus: EventBus<ClientEvents>) {
    const entities = entityContainer.createQuery('display', 'ambientAnimations');

    const animationSpriteMappings = new Map<EntityDisplay, AnimationSpriteMapping>();

    entities.on('add', updateAmbientAnimations);
    entities.on('update', updateAmbientAnimations);

    entities.on('remove', ({ display }) => {
        updateAmbientAnimations({ display, ambientAnimations: [] });
        animationSpriteMappings.delete(display);
    });

    eventBus.on('effectAnimationAction', ({ entityId, effectAnimation }) => {
        const entity = entityContainer.getEntity(entityId);
        if (!entity) {
            return;
        }

        const { display } = entity.components;
        if (!display) {
            return;
        }

        const animatedSprite = effectAnimationSprite(effectAnimation);
        animatedSprite.loop = false;
        animatedSprite.onComplete = () => {
            animatedSprite.parent.removeChild(animatedSprite);
            animatedSprite.destroy({ children: true });
        };
        display.animationEffectFg.addChild(animatedSprite);
    });


    function updateAmbientAnimations({ display, ambientAnimations }: PartialPick<ClientComponents, 'display' | 'ambientAnimations'>) {
        let mapping = animationSpriteMappings.get(display);
        if (!mapping) {
            mapping = {};
            animationSpriteMappings.set(display, mapping);
        }

        const existingMappingKeys = [];
        for (const ambientAnimation of ambientAnimations) {
            const mappingKey = ambientAnimation.image + ':' + ambientAnimation.animation;
            existingMappingKeys.push(mappingKey);
            let animatedSprite = mapping[mappingKey];
            if (animatedSprite) {
                continue;
            }
            animatedSprite = effectAnimationSprite(ambientAnimation);
            mapping[mappingKey] = animatedSprite;

            display.animationEffectFg.addChild(animatedSprite);
        }

        for (const mappingKey of Object.keys(mapping)) {
            if (existingMappingKeys.indexOf(mappingKey) !== -1) {
                continue;
            }

            const animatedSprite = mapping[mappingKey]!;
            delete mapping[mappingKey];
            animatedSprite.parent.removeChild(animatedSprite);
            animatedSprite.destroy({ children: true });
        }
    }
}

function effectAnimationSprite(effectAnimation: EffectAnimation): AnimatedSprite {
    const fileName = `fx/${effectAnimation.image}`;
    const animation = effectAnimation.animation;

    const animatedSprite = textureLoader.createCustomAnimatedSprite(fileName, fileName, animation, '');
    animatedSprite.blendMode = PIXI.BLEND_MODES.ADD; //TODO in json?
    return animatedSprite;
}