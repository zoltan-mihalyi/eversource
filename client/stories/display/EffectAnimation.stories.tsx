import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { EffectAnimation } from '../../../common/components/CommonComponents';
import { ClientComponents } from '../../src/es/ClientComponents';
import { X, Y } from '../../../common/domain/Location';
import { DisplayScreen } from './DisplayScreen';

function createEffectDemo(...animations: EffectAnimation[]): React.ReactElement<any> {
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
            type: 'object',
            image: 'plants',
            animation: 'carrot'
        },
        ambientAnimations: animations,
    };

    return (
        <DisplayScreen template={template} backgroundColor={0x1c6300}/>
    );
}

storiesOf('AnimationEffects', module)
    .add('quest-object-glow', () => createEffectDemo({ image: 'quest-object-glow', animation: 'glow' }));
