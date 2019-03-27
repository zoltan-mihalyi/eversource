import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { LoginScreen } from '../src/components/menu/LoginScreen';
import { CHARACTERS } from './SampleData';
import { CreditsScreen } from '../src/components/menu/CreditsScreen';
import { CharacterSelectionScreen } from '../src/components/menu/CharacterSelectionScreen';
import { LoadingScreen } from '../src/components/menu/LoadingScreen';

function noop() {
}

storiesOf('Screen', module)
    .add('LoginScreen', () => (
        <LoginScreen onSubmit={noop} showCredits={noop} loginState={{ type: 'initial' }}/>
    ))
    .add('ConnectingScreen', () => (
        <LoginScreen onSubmit={noop} showCredits={noop} loginState={{ type: 'connecting' }}/>
    ))
    .add('CharacterSelectionScreen', () => (
        <CharacterSelectionScreen characters={CHARACTERS} onExit={noop} onSelect={noop}/>
    ))
    .add('LoadingScreen', () => (
        <LoadingScreen zone="Enchanted Forest"/>
    ))
    .add('CreditsScreen', () => (
        <CreditsScreen onExit={noop}/>
    ));
