import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Effect } from '../../../common/components/CommonComponents';
import { ClientComponents } from '../../src/es/ClientComponents';
import { X, Y } from '../../../common/domain/Location';
import { DisplayScreen } from './DisplayScreen';

function createEffectDemo(...effects: Effect[]): React.ReactElement<any> {
    const template: Partial<ClientComponents> = {
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
    };

    return (
        <DisplayScreen template={template}/>
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


