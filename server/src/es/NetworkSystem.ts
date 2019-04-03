import { EntityContainer } from '../../../common/es/EntityContainer';
import { ServerComponents } from './ServerComponents';
import { CommonComponents } from '../../../common/components/CommonComponents';

export const COMMON_COMPONENTS: (keyof CommonComponents)[] = [
    'position',
    'level',
    'hp',
    'view',
    'direction',
    'animation',
    'activity',
    'attitude',
    'name',
    'scale',
    'effects',
    'player',
];

export function networkSystem(container: EntityContainer<ServerComponents>) {
    for (const component of COMMON_COMPONENTS) {
        const query = container.createQuery('viewers', component);

        query.on('update', ({ viewers }) => {
            viewers.forEach((changes) => {
                changes.add(component);
            });
        });
    }
}
