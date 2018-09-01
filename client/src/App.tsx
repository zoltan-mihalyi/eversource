import * as React from 'react';
import { ReactChild } from 'react';
import { LoginScreen, LoginState } from './components/menu/LoginScreen';
import { GameScreen } from './components/game/GameScreen';
import { CharacterSelectionScreen } from './components/menu/CharacterSelectionScreen';
import { CharacterId, CharacterInfo } from '../../common/domain/CharacterInfo';
import { LoadingScreen } from './components/menu/LoadingScreen';
import { parseCommand } from './utils';

type ShowLoginScreen = {
    type: 'login'
    state: LoginState
}
type ShowCharacterSelectionScreen = {
    type: 'characters';
    ws: WebSocket;
    characters: CharacterInfo[];
}
type ShowLoadingScreen = {
    type: 'loading';
    ws: WebSocket;
}
type ShowGameScreen = {
    type: 'game';
    ws: WebSocket;
}

type ShowScreen = ShowLoginScreen | ShowCharacterSelectionScreen | ShowLoadingScreen | ShowGameScreen;

interface State {
    screen: ShowScreen;
}

const wsUri = 'ws://localhost:8080';

export class App extends React.Component<{}, State> {
    state: State = {
        screen: { type: 'login', state: { type: 'initial' } },
    };

    render(): ReactChild {
        const screen = this.state.screen;
        switch (screen.type) {
            case 'login':
                return (
                    <LoginScreen onSubmit={this.onSubmitLogin} loginState={screen.state}/>
                );
            case 'characters':
                return (
                    <CharacterSelectionScreen characters={screen.characters} exit={() => this.exit(screen.ws)}
                                              startLoading={(id: CharacterId) => this.startLoading(screen.ws, id)}/>
                );
            case 'loading':
                return (
                    <LoadingScreen/>
                );
            case 'game':
                return (
                    <GameScreen enterCharacterSelection={() => this.enterCharacterSelection(screen.ws)}/>
                );
        }
    }

    private startLoading(ws: WebSocket, id: CharacterId) {
        ws.send('enter:' + id);
        this.setState({
            screen: { type: 'loading', ws },
        });

        setTimeout(() => {
            ws.send('ready');
        }, 100); // TODO
    };

    private onSubmitLogin = () => {
        const ws = new WebSocket(wsUri);

        this.setState({
            screen: {
                type: 'login',
                state: { type: 'connecting' },
            },
        });

        ws.onopen = evt => {
            this.enterCharacterLoading(ws);
        };
        ws.onclose = evt => {
            this.setState({
                screen: {
                    type: 'login',
                    state: { type: 'error', message: 'closed' },
                },
            });
        };
        ws.onmessage = evt => {
            const command = parseCommand(evt.data);

            const { screen } = this.state;
            switch (screen.type) {
                case 'login':
                    this.setState({
                        screen: {
                            type: 'characters',
                            characters: command.data,
                            ws,
                        },
                    });
                    break;
                case 'loading':
                    this.enterGame(ws);
            }
        };
        ws.onerror = evt => {
            this.setState({
                screen: {
                    type: 'login',
                    state: {
                        type: 'error',
                        message: evt + '',
                    },
                },
            });
        };

    };

    private enterCharacterLoading(ws: WebSocket) {
        ws.send('characters');
        this.setState({
            screen: {
                type: 'login',
                state: { type: 'characters' },
            },
        });
    }

    private exit(ws: WebSocket) {
        ws.close();
    }

    private enterCharacterSelection = (ws: WebSocket) => {
        ws.send('leave');
        this.enterCharacterLoading(ws);
    };

    private enterGame = (ws: WebSocket) => {
        this.setState({
            screen: { type: 'game', ws },
        });
    };
}