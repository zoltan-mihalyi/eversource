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
import { NetworkingContext, NetworkingState } from './protocol/NetworkingState';
import { StateManager } from '../../common/util/StateManager';

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

    private stateManager: StateManager<NetworkingState<any>, NetworkingContext> | null = null;

    componentDidMount() {
        window.addEventListener('error', this.onError);
        window.addEventListener('unhandledrejection', this.onPromiseRejection);
    }

    componentWillUnmount() {
        window.removeEventListener('error', this.onError);
        window.removeEventListener('unhandledrejection', this.onPromiseRejection);
    }

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
                    <GameScreen inputManager={screen.game.inputManager} canvas={screen.game.view}
                                setScale={screen.game.setScale} onMount={screen.onMount}
                                textureLoader={screen.game.textureLoader}
                                playingNetworkApi={screen.playingNetworkApi}/>
                );
        }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        this.handleApplicationError(error);
    }

    private handleApplicationError(error: Error) {
        // TODO send error log
        const message = 'Application error';
        if (this.stateManager) { // TODO stateManager always available?
            this.stateManager.getCurrentState().onError(message);
        } else {
            this.showError(message);
        }
    }

    private onError = (event: ErrorEvent) => {
        this.handleApplicationError(event.error);
    };

    private onPromiseRejection = (event: Event) => {
        this.handleApplicationError((event as PromiseRejectionEvent).reason);
    };

    private onSubmitLogin = (username: string, password: string) => {
        this.stateManager = connect(this, wsUri, username, password, () => {
            this.stateManager = null;
        });
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

    showError(message: string) {
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
