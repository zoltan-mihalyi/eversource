import * as React from 'react';
import { ReactChild } from 'react';
import { LoginScreen, LoginState } from './components/menu/LoginScreen';
import { GameScreen } from './components/game/GameScreen';
import { CharacterSelectionScreen } from './components/menu/CharacterSelectionScreen';
import { CharacterInfo } from '../../common/domain/CharacterInfo';
import { LoadingScreen } from './components/menu/LoadingScreen';
import { ZoneId } from '../../common/domain/Location';
import { GameApplication } from './map/GameApplication';
import { Display } from './protocol/Display';
import { connect } from './protocol/NetworkHandler';
import { CreditsScreen } from './components/menu/CreditsScreen';
import { PlayingNetworkApi } from './protocol/PlayingState';

type ShowLoginScreen = {
    type: 'login';
    state: LoginState;
}
type ShowCreditsScreen = {
    type: 'credits';
}
type ShowCharacterSelectionScreen = {
    type: 'characters';
    characters: CharacterInfo[];
    onSelect: (character: CharacterInfo) => void;
    onExit: () => void;
}
type ShowLoadingScreen = {
    type: 'loading';
    zoneId: ZoneId;
}
type ShowGameScreen = {
    type: 'game';
    game: GameApplication;
    onMount: (gameScreen: GameScreen) => void;
    playingNetworkApi: PlayingNetworkApi;
}

type ShowScreen =
    ShowLoginScreen
    | ShowCreditsScreen
    | ShowCharacterSelectionScreen
    | ShowLoadingScreen
    | ShowGameScreen;

interface State {
    screen: ShowScreen;
}

const protocol = location.protocol === 'http:' ? 'ws' : 'wss';

const wsUri = `${protocol}://${location.hostname}:${location.port}`;

export class App extends React.Component<{}, State> implements Display {
    state: State = {
        screen: { type: 'login', state: { type: 'initial' } },
    };

    render(): ReactChild {
        const screen = this.state.screen;
        switch (screen.type) {
            case 'login':
                return (
                    <LoginScreen onSubmit={this.onSubmitLogin} showCredits={this.showCredits}
                                 loginState={screen.state}/>
                );
            case 'credits':
                return (
                    <CreditsScreen onExit={this.showLogin}/>
                );
            case 'characters':
                return (
                    <CharacterSelectionScreen characters={screen.characters} onExit={screen.onExit}
                                              onSelect={screen.onSelect}/>
                );
            case 'loading':
                return (
                    <LoadingScreen zone={screen.zoneId}/>
                );
            case 'game':
                return (
                    <GameScreen game={screen.game} onMount={screen.onMount} playingNetworkApi={screen.playingNetworkApi}/>
                );
        }
    }

    private onSubmitLogin = (username: string, password: string) => {
        connect(this, wsUri, username, password);
    };

    private showCredits = () => {
        this.setState({
            screen: {
                type: 'credits',
            },
        });
    };

    showLogin = () => {
        this.setState({
            screen: {
                type: 'login',
                state: { type: 'initial' },
            },
        });
    };

    showConnecting() {
        this.setState({
            screen: {
                type: 'login',
                state: { type: 'connecting' },
            },
        });
    }

    showCharacterLoading() {
        this.setState({
            screen: {
                type: 'login',
                state: { type: 'characters' },
            },
        });
    }

    showConnectionError(message: string) {
        this.setState({
            screen: {
                type: 'login',
                state: { type: 'error', message },
            },
        });
    }

    showCharacterSelection(characters: CharacterInfo[], onSelect: (character: CharacterInfo) => void, onExit: () => void) {
        this.setState({
            screen: {
                type: 'characters',
                characters,
                onSelect,
                onExit,
            },
        });
    }

    showLoading(zoneId: ZoneId) {
        this.setState({
            screen: {
                type: 'loading',
                zoneId,
            },
        });
    }

    showGame(game: GameApplication, onMount: (gameScreen: GameScreen) => void, playingNetworkApi: PlayingNetworkApi) {
        this.setState({
            screen: {
                type: 'game',
                onMount,
                playingNetworkApi,
                game,
            },
        });
    }
}