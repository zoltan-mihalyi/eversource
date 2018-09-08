import * as React from 'react';
import { ReactChild } from 'react';
import { LoginScreen, LoginState } from './components/menu/LoginScreen';
import { GameScreen } from './components/game/GameScreen';
import { CharacterSelectionScreen } from './components/menu/CharacterSelectionScreen';
import { CharacterInfo } from '../../common/domain/CharacterInfo';
import { LoadingScreen } from './components/menu/LoadingScreen';
import { parseCommand, pixiLoader } from './utils';
import * as PIXI from 'pixi.js';
import { Loader, Map, TileSet } from '@eversource/tmx-parser';
import { GameLevel } from './map/GameLevel';
import * as path from 'path';
import { Location } from '../../common/domain/Location';
import { GameState } from '../../common/protocol/Messages';
import { GameApplication } from './map/GameApplication';

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
    location: Location;
    gameLevel?: GameLevel;
}
type ShowGameScreen = {
    type: 'game';
    game: GameApplication;
    ws: WebSocket;
}

type ShowScreen = ShowLoginScreen | ShowCharacterSelectionScreen | ShowLoadingScreen | ShowGameScreen;

interface State {
    screen: ShowScreen;
}

const basePath = './dist/maps';
const wsUri = `ws://${location.hostname}:8080`;

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
                                              startLoading={(ch: CharacterInfo) => this.startLoading(screen.ws, ch)}/>
                );
            case 'loading':
                return (
                    <LoadingScreen zone={screen.location.zoneId}/>
                );
            case 'game':
                return (
                    <GameScreen game={screen.game}
                                enterCharacterSelection={() => this.enterCharacterSelection(screen.game, screen.ws)}/>
                );
        }
    }

    private startLoading(ws: WebSocket, character: CharacterInfo) {
        const { id, location } = character;

        ws.send(`enter:${id}`);
        const { zoneId } = character.location;

        new Loader(pixiLoader).parseFile(`${basePath}/${zoneId}.xml`, (err: any, map?: Map | TileSet) => {
            const textureLoader = new PIXI.loaders.Loader();

            for (const tileSet of (map as Map).tileSets) {
                textureLoader.add(tileSet.image!.source, path.join(basePath, path.dirname(tileSet.source), tileSet.image!.source));
            }

            textureLoader.load(() => {
                this.setState({
                    screen: {
                        type: 'loading',
                        location,
                        ws,
                        gameLevel: new GameLevel(map as Map, textureLoader.resources),
                    },
                });
                ws.send('ready');
            });

        });

        this.setState({
            screen: {
                type: 'loading',
                location,
                ws,
            },
        });
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
                case 'loading': {
                    const game = new GameApplication(screen.gameLevel!, screen.location, ws);
                    this.setState({
                        screen: {
                            type: 'game',
                            ws,
                            location: screen.location,
                            game,
                        }, // TODO
                    });
                    break;
                }
                case 'game': {
                    screen.game.updateState(command.data as GameState);
                }
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

    private enterCharacterSelection = (game: GameApplication, ws: WebSocket) => {
        game.destroy();
        ws.send('leave');
        this.enterCharacterLoading(ws);
    };
}