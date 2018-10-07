import * as React from 'react';
import { ReactChild } from 'react';
import { LoginScreen, LoginState } from './components/menu/LoginScreen';
import { GameScreen } from './components/game/GameScreen';
import { CharacterSelectionScreen } from './components/menu/CharacterSelectionScreen';
import { CharacterInfo } from '../../common/domain/CharacterInfo';
import { LoadingScreen } from './components/menu/LoadingScreen';
import { ZoneId } from '../../common/domain/Location';
import { PROTOCOL_VERSION } from '../../common/protocol/Messages';
import { GameApplication } from './map/GameApplication';
import { Display } from './protocol/Display';
import { NetworkHandler } from './protocol/NetworkHandler';
import { CreditsScreen } from './components/menu/CreditsScreen';

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
    enterCharacterSelection: () => void;
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

const wsUri = `ws://${location.hostname}:${location.port}`;

export class App extends React.Component<{}, State> {
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
                    <GameScreen game={screen.game} enterCharacterSelection={screen.enterCharacterSelection}/>
                );
        }
    }

    private onSubmitLogin = (username: string, password: string) => {
        const ws = new WebSocket(wsUri);

        ws.onopen = () => {
            ws.send(JSON.stringify({
                v: PROTOCOL_VERSION,
                username: username,
                password: password,
            }));
        };

        const display: Display = {
            showLogin: () => {
                this.setState({
                    screen: {
                        type: 'login',
                        state: { type: 'initial' },
                    },
                });
            },
            showCharacterLoading: () => {
                this.setState({
                    screen: {
                        type: 'login',
                        state: { type: 'characters' },
                    },
                });
            },
            showConnectionError: (message: string) => {
                this.setState({
                    screen: {
                        type: 'login',
                        state: { type: 'error', message },
                    },
                });
            },
            showCharacterSelection: (characters: CharacterInfo[], onSelect: (character: CharacterInfo) => void, onExit: () => void) => {
                this.setState({
                    screen: {
                        type: 'characters',
                        characters,
                        onSelect,
                        onExit,
                    },
                });
            },
            showLoading: (zoneId: ZoneId) => {
                this.setState({
                    screen: {
                        type: 'loading',
                        zoneId,
                    },
                });
            },

            showGame: (game: GameApplication, enterCharacterSelection: () => void) => {
                this.setState({
                    screen: {
                        type: 'game',
                        enterCharacterSelection,
                        game,
                    },
                });
            },
        };

        new NetworkHandler(ws, display);

        this.setState({
            screen: {
                type: 'login',
                state: { type: 'connecting' }, // TODO onEnter?
            },
        });
    };

    private showCredits = () => {
        this.setState({
            screen: {
                type: 'credits',
            },
        });
    };

    private showLogin = () => {
        this.setState({
            screen: { type: 'login', state: { type: 'initial' } },
        });
    };
}