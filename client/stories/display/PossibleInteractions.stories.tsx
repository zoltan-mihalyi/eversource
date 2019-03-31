import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { ClientComponents } from '../../src/es/ClientComponents';
import { X, Y } from '../../../common/domain/Location';
import { DisplayScreen } from './DisplayScreen';
import { PossibleInteraction } from '../../../common/components/NetworkComponents';
import { Gui } from '../../src/components/common/Gui';

function createInteractionDemo(possibleInteractions: PossibleInteraction[], extra?: Partial<ClientComponents>): React.ReactElement<any> {
    const template: Partial<ClientComponents> = {
        activity: 'standing',
        direction: 'down',
        name: {
            value: 'Spider',
        },
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
        ...extra,
    };
    if (possibleInteractions.length > 0) {
        template.possibleInteractions = possibleInteractions;
    }

    return (
        <DisplayScreen template={template}/>
    );
}

storiesOf('PossibleInteractions', module)
    .addDecorator((story) => (
        <Gui>{story()}</Gui>
    ))
    .add('empty', () => createInteractionDemo([]))
    .add('story', () => createInteractionDemo(['story']))
    .add('single', () => createInteractionDemo(['quest']))
    .add('chat', () => createInteractionDemo(['quest'], {
        chatMessageDisplay: {
            createdAt: new Date(Infinity),
            text: 'Chit-chat',
        },
    }))
    .add('multiple', () => createInteractionDemo(['quest', 'quest-complete']));


