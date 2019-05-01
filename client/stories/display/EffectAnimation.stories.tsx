import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { EffectAnimation } from '../../../common/components/CommonComponents';
import { ClientComponents } from '../../src/es/ClientComponents';
import { X, Y } from '../../../common/domain/Location';
import { createDisplayScreenComponents } from './DisplayScreen';
import { HUMANOID_VIEW } from './DisplaySampleData';
import { TestScreen } from './TestScreen';

const TEMPLATE: Partial<ClientComponents> = {
    activity: 'walking',
    direction: 'right',
    position: {
        x: 0 as X,
        y: 0 as Y,
    },
    animation: {
        speed: 3,
    },
    view: {
        type: 'object',
        image: 'plants',
        animation: 'carrot',
    },
};

function createToggleableEffectDemo(ambientAnimations: EffectAnimation[]) {
    const screenComponents = createDisplayScreenComponents({
        ...TEMPLATE,
        ambientAnimations,
    });

    function toggle() {
        const { entity } = screenComponents;
        if (entity.components.ambientAnimations!.length) {
            entity.set('ambientAnimations', []);
        } else {
            entity.set('ambientAnimations', ambientAnimations)
        }
    }

    return (
        <>
            <TestScreen display={screenComponents.objectContainer} eventBus={screenComponents.eventBus} backgroundColor={0x1c6300}/>
            <button onClick={toggle}>Toggle</button>
        </>
    );
}

function createActionAnimationDemo(effectAnimations: EffectAnimation[]) {
    const screenComponents = createDisplayScreenComponents({
        ...TEMPLATE,
        view: HUMANOID_VIEW,
    });

    function fire(effectAnimation: EffectAnimation) {
        screenComponents.eventBus.emit('effectAnimationAction', { type: 'effect', entityId: screenComponents.entity.id, effectAnimation });
    }

    return (
        <>
            <TestScreen display={screenComponents.objectContainer} eventBus={screenComponents.eventBus} backgroundColor={0x1c6300}/>
            {effectAnimations.map((animation, i) => (
                <button key={i} onClick={() => fire(animation)}>{animation.image}</button>
            ))}
        </>
    );
}

storiesOf('EffectAnimation', module)
    .add('quest-object-glow', () => createToggleableEffectDemo([{ image: 'quest-object-glow', animation: 'glow' }]))
    .add('action', () => createActionAnimationDemo([
        { image: 'level-up', animation: 'level-up' },
        { image: 'heal1', animation: 'heal1' },
        { image: 'heal3', animation: 'heal3' },
    ]));
