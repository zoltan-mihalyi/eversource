import { ClientComponents } from '../../es/ClientComponents';
import { EntityContainer } from '../../../../common/es/EntityContainer';
import { EventBus } from '../../../../common/es/EventBus';
import { ClientEvents } from '../../es/ClientEvents';
import { Activity, Animation, Scale } from '../../../../common/components/CommonComponents';

export function displayAnimationSystem(container: EntityContainer<ClientComponents>, eventBus: EventBus<ClientEvents>) {

    const entities = container.createQuery('display', 'activity');

    eventBus.on('render', () => { // TODO perf?
        entities.forEach(({ display, animation, activity, scale, fixAnimationSpeed }) => {
            const speed = calculateAnimationSpeed(fixAnimationSpeed, activity, animation, scale);
            display.setAnimationSpeed(speed);
        });
    });
}

function calculateAnimationSpeed(fixAnimationSpeed: number | null | undefined, activity: Activity, animation?: Animation, scale?: Scale): number {
    if (!animation) {
        return 1;
    }
    if (typeof fixAnimationSpeed === 'number') {
        return fixAnimationSpeed;
    }
    if (fixAnimationSpeed === void 0) {
        return 0;
    }

    switch (activity) {
        case 'standing':
            return 0.08;
        case 'walking':
            return animation.speed / 14 / (scale ? scale.value : 1);
        case 'casting':
            return 0.25;
    }
}
