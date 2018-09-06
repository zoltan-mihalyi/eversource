import * as React from 'react';
import { ReactChild } from 'react';
import { LoginScreen, LoginState } from './components/menu/LoginScreen';
import { GameScreen } from './components/game/GameScreen';
import { CharacterSelectionScreen } from './components/menu/CharacterSelectionScreen';
import { CharacterInfo } from '../../common/domain/CharacterInfo';
import { LoadingScreen } from './components/menu/LoadingScreen';
import { parseCommand } from './utils';
import * as PIXI from 'pixi.js';
import { Loader, Map, TileSet } from '@eversource/tmx-parser';
import { GameLevel } from './map/GameLevel';
import * as path from 'path';
import { Location, X, Y, ZoneId } from '../../common/domain/Location';

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
    zone: string;
    gameLevel?: GameLevel;
}
type ShowGameScreen = {
    type: 'game';
    ws: WebSocket;
    gameLevel: GameLevel;
    location: Location;
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
                    <LoadingScreen zone={screen.zone}/>
                );
            case 'game':
                return (
                    <GameScreen gameLevel={screen.gameLevel} location={screen.location}
                                enterCharacterSelection={() => this.enterCharacterSelection(screen.ws)}/>
                );
        }
    }

    private startLoading(ws: WebSocket, character: CharacterInfo) {
        ws.send('enter:' + character.id);
        const zoneId = character.location.zoneId;

        const pixiLoader = (file: string, cb: (err: any, data: string) => void) => {
            const loader = new PIXI.loaders.Loader()
                .add('file', file)
                .load(() => {
                    cb(null, (loader.resources.file.xhr as any).responseText);
                });
        };
        new Loader(pixiLoader).parseFile(`${basePath}/${zoneId}.xml`, (err: any, map?: Map | TileSet) => {
            const textureLoader = new PIXI.loaders.Loader();

            for (const tileSet of (map as Map).tileSets) {
                textureLoader.add(tileSet.image!.source, path.join(basePath, path.dirname(tileSet.source), tileSet.image!.source));
            }

            textureLoader.load(() => {
                this.setState({
                    screen: {
                        type: 'loading',
                        zone: zoneId,
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
                zone: zoneId,
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
                case 'loading':
                    this.setState({
                        screen: {
                            type: 'game',
                            ws,
                            location: { x: 106 as X, y: 214 as Y, zoneId: 'lavaland' as ZoneId }, //TODO
                            gameLevel: screen.gameLevel!,
                        }, // TODO
                    });
                    break;
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
}