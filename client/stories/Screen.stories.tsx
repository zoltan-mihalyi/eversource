import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Gui } from '../src/components/common/Gui';
import { LoginScreen } from '../src/components/menu/LoginScreen';
import { GameScreen } from '../src/components/game/GameScreen';
import { InputManager } from '../src/input/InputManager';
import { CHARACTERS, FAKE_API, QUEST_LOG, textureLoader } from './SampleData';
import { CreditsScreen } from '../src/components/menu/CreditsScreen';
import { CharacterSelectionScreen } from '../src/components/menu/CharacterSelectionScreen';
import { LoadingScreen } from '../src/components/menu/LoadingScreen';

function noop() {
}

const canvas = document.createElement('canvas');
const inputManager = new InputManager();

storiesOf('Screen', module)
    .add('LoginScreen', () => (
        <LoginScreen onSubmit={noop} showCredits={noop} loginState={{ type: 'initial' }}/>
    ))
    .add('ConnectingScreen', () => (
        <LoginScreen onSubmit={noop} showCredits={noop} loginState={{ type: 'connecting' }}/>
    ))
    .add('CharacterSelectionScreen', () => (
        <CharacterSelectionScreen characters={CHARACTERS} onExit={noop} onSelect={noop} />
    ))
    .add('LoadingScreen', () => (
        <LoadingScreen zone="Enchanted Forest" />
    ))
    .add('CreditsScreen', () => (
        <CreditsScreen onExit={noop}/>
    ))
    .add('GameScreen', () => (
        <GameScreen setScale={noop} canvas={canvas} inputManager={inputManager} onMount={initScreen}
                    playingNetworkApi={FAKE_API} textureLoader={textureLoader}/>
    ));

function initScreen(gameScreen: GameScreen) {
    gameScreen.updateQuestLog(QUEST_LOG);
    gameScreen.updatePlayerState({
        character: {
            xp: 730,
            level: 12,
            name: 'Test',
            sex: 'male',
            classId: 'warrior',
            inventorySize: 10,
        },
        interaction: null,
    });
    gameScreen.chatMessageReceived({ sender: 'John', text: 'Hello there!' });
    gameScreen.chatMessageReceived({ sender: 'John', text: 'What happens, when a very long message is added?' });
}
