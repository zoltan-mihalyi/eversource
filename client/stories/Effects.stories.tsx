import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { TextureLoader } from '../src/map/TextureLoader';
import { CancellableProcess } from '../../common/util/CancellableProcess';
import { app, TestScreen } from './TestScreen';
import { Direction, Effect } from '../../common/components/CommonComponents';
import { EntityContainer } from '../../common/es/EntityContainer';
import { EventBus } from '../../common/es/EventBus';
import { completeDisplaySystem } from '../src/systems/display/CompleteDisplaySystem';
import { Metric } from '../src/systems/display/Metric';
import { ClientComponents } from '../src/es/ClientComponents';
import { ClientEvents } from '../src/es/ClientEvents';
import { EntityId } from '../../common/es/Entity';
import { X, Y } from '../../common/domain/Location';
import { nextValue } from '../../common/util/utils';

const textureLoader = new TextureLoader(app.renderer, new CancellableProcess(), 32);

const DIRECTIONS: Direction[] = [
    'right',
    'down',
    'left',
    'up',
];

function createEffectDemo(...effects: Effect[]): React.ReactElement<any> {
    const container = new EntityContainer<ClientComponents>();
    const eventBus = new EventBus<ClientEvents>();
    eventBus.on('interact', () => {
        entity.set('direction', nextValue(DIRECTIONS, entity.components.direction!));
    });

    const objectContainer = completeDisplaySystem(container, eventBus, new Metric(32, 32), textureLoader);

    const entity = container.createEntityWithId(0 as EntityId, {
        activity: 'walking',
        direction: 'right',
        position: {
            x: 0 as X,
            y: 0 as Y,
        },
        animation: {
            speed: 5,
        },
        view: {
            type: 'simple',
            image: 'spider01',
            palette: null,
        },
        effects,
    });

    return (
        <TestScreen display={objectContainer} eventBus={eventBus} backgroundColor={0xffcc88}/>
    );
}

storiesOf('Effects', module)
    .add('speed', () => createEffectDemo({ type: 'speed', param: 2 }))
    .add('alpha', () => createEffectDemo({ type: 'alpha', param: 0.5 }))
    .add('fire', () => createEffectDemo({ type: 'fire', param: 1 }))
    .add('ice', () => createEffectDemo({ type: 'ice', param: 1 }))
    .add('poison', () => createEffectDemo({ type: 'poison', param: 1 }))
    .add('stone', () => createEffectDemo({ type: 'stone', param: 1 }))
    .add('light', () => createEffectDemo({ type: 'light', param: 1 }))
    .add('multiple', () => createEffectDemo(
        { type: 'speed', param: 2 },
        { type: 'alpha', param: 0.5 },
        { type: 'fire', param: 1 }),
    )
    .add('multiple color', () => createEffectDemo({ type: 'poison', param: 1 }, { type: 'ice', param: 1 }))


