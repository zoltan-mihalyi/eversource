import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { ClientComponents } from '../../src/es/ClientComponents';
import { X, Y } from '../../../common/domain/Location';
import { DisplayScreen } from './DisplayScreen';
import { Gui } from '../../src/components/common/Gui';
import { ColoredImage } from '../../../common/domain/ColoredImage';

function createHairDemo(head: ColoredImage): React.ReactElement<any> {
    const template: Partial<ClientComponents> = {
        activity: 'walking',
        direction: 'down',
        name: {
            value: 'Spider',
        },
        position: {
            x: 0 as X,
            y: 0 as Y,
        },
        animation: {
            speed: 3,
        },
        view: {
            type: 'humanoid',
            appearance: {
                sex: 'female',
                body: ['normal'],
                eyes: [],
                ears: [],
                facial: [],
                hair: ['xlong', 'redhead'],
                nose: []
            },
            equipment: {
                head,
                shirt: [],
                arms: [],
                belt: [],
                cape: [],
                chest: [],
                feet: [],
                hands: [],
                legs: [],
                mask: [],
            }
        },
    };

    return (
        <DisplayScreen template={template}/>
    );
}

storiesOf('Hair', module)
    .addDecorator((story) => (
        <Gui>{story()}</Gui>
    ))
    .add('no head', () => createHairDemo([]))
    .add('tiara', () => createHairDemo(['tiara']))
    .add('half', () => createHairDemo(['chainhat']))
    .add('half 2', () => createHairDemo(['leather_cap']))
    .add('half 3', () => createHairDemo(['bandana', 'green']))
    .add('closed', () => createHairDemo(['chain_hood']))
    .add('closed 2', () => createHairDemo(['ornate_metal_helm_open', 'gold']))
    .add('closed 3', () => createHairDemo(['cloth_hood']));


