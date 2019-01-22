import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Gui } from '../src/components/common/Gui';
import { LoginScreen } from '../src/components/menu/LoginScreen';
import { GameScreen } from '../src/components/game/GameScreen';
import { InputManager } from '../src/input/InputManager';
import { FAKE_API, QUEST_LOG } from './SampleData';
import { EntityId } from '../../common/domain/EntityData';

function noop() {
}

const canvas = document.createElement('canvas');
const inputManager = new InputManager();

storiesOf('Screen', module)
    .addDecorator((story => (
        <Gui>{story()}</Gui>
    )))
    .add('LoginScreen', () => (
        <LoginScreen onSubmit={noop} showCredits={noop} loginState={{ type: 'initial' }}/>
    ))
    .add('GameScreen', () => (
        <GameScreen setScale={noop} canvas={canvas} inputManager={inputManager} onMount={initScreen}
                    playingNetworkApi={FAKE_API}/>
    ));

function initScreen(gameScreen: GameScreen) {
    gameScreen.updateQuestLog(QUEST_LOG);
    gameScreen.updatePlayerState({
        character: {
            xp: 730,
            level:12,
            id: 0 as EntityId,
        },
        interaction: null,
    });
}
