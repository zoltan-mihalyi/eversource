import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Gui } from '../src/components/common/Gui';
import { LoginScreen } from '../src/components/menu/LoginScreen';
import { GameMenu } from '../src/components/game/GameMenu';
import { QUEST_LOG } from './SampleData';

function noop() {
}

storiesOf('Screen', module)
    .addDecorator((story => (
        <Gui>{story()}</Gui>
    )))
    .add('LoginScreen', () => (
        <LoginScreen onSubmit={noop} showCredits={noop} loginState={{ type: 'initial' }}/>
    ))
    .add('GameMenu', () => (
        <GameMenu questLog={QUEST_LOG} onLeave={noop}/>
    ));
