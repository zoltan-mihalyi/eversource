import * as React from 'react';
import { PlayingNetworkApi } from '../../protocol/PlayingState';
import { QuestId } from '../../../../common/domain/InteractionTable';
import { InteractionDialog } from '../quest/InteractionDialog';
import { PlayerState } from '../../../../common/protocol/PlayerState';
import { QuestLogItem } from '../../../../common/protocol/QuestLogItem';
import { GameMenu } from './GameMenu';
import { DebugInfo } from '../gui/DebugInfo';
import { settings } from '../../settings/SettingsStore';
import { InputManager } from '../../input/InputManager';
import { XpBar } from './XpBar';
import { maxXpFor } from '../../../../common/algorithms';
import { Gui } from '../common/Gui';
import CharacterContext, { EMPTY_CHARACTER } from '../CharacterContext';
import { ChatBox } from '../chat/ChatBox';
import { Positioned } from '../common/Positioned';
import { ChatMessage } from '../../../../common/protocol/Messages';

const MAX_MESSAGES = 100;

interface Props {
    setScale: (width: number, height: number, scale: number) => void;
    inputManager: InputManager;
    canvas: HTMLCanvasElement;
    onMount: (gameScreen: GameScreen) => void;
    playingNetworkApi: PlayingNetworkApi;
}

interface State {
    messages: ChatMessage[];
    playerState: PlayerState;
    questLog: Map<QuestId, QuestLogItem>;
    debug: boolean;
}

interface ImageStyle extends CSSStyleDeclaration {
    imageRendering: string;
}

export class GameScreen extends React.Component<Props, State> {
    private canvas: HTMLCanvasElement | null = null;
    private chatBoxInput = React.createRef<HTMLInputElement>();

    state: State = {
        messages: [],
        playerState: { interaction: null, character: null },
        questLog: new Map<QuestId, QuestLogItem>(),
        debug: settings.get('debug') || false,
    };

    render() {
        const { playerState: { interaction, character }, questLog, debug } = this.state;

        const displayCharacter = character || EMPTY_CHARACTER;

        return (
            <Gui>
                <CharacterContext.Provider value={displayCharacter}>
                    <div ref={this.containerRef}/>

                    <Positioned horizontal="left" vertical="bottom">
                        <ChatBox inputRef={this.chatBoxInput} sendMessage={this.sendChatMessage}
                                 messages={this.state.messages}/>
                    </Positioned>
                    <Positioned horizontal="stretch" vertical="bottom">
                        <XpBar level={displayCharacter.level} xp={displayCharacter.xp}
                               maxXp={maxXpFor(displayCharacter.level)}/>
                    </Positioned>

                    {debug && <DebugInfo/>}
                    {interaction &&
                    <InteractionDialog interactions={interaction} onAcceptQuest={this.acceptQuest}
                                       onCompleteQuest={this.completeQuest}
                                       onClose={this.closeInteraction}/>}

                    <div ref={this.joystickContainerRef}/>
                    <GameMenu questLog={questLog} onLeave={this.leave} onAbandonQuest={this.abandonQuest}/>
                </CharacterContext.Provider>
            </Gui>
        );
    }

    componentDidMount() {
        this.props.onMount(this);
        document.body.addEventListener('keypress', this.onKeyDown);
    }

    componentWillUnmount() {
        document.body.removeEventListener('keypress', this.onKeyDown);
    }

    updatePlayerState(playerState: PlayerState) { // TODO interface
        this.setState({ playerState });
    }

    chatMessageReceived(message: ChatMessage) {
        this.setState((state) => {
            const messages = [...state.messages, message];
            if (messages.length > MAX_MESSAGES) {
                messages.shift();
            }

            return {
                messages,
            };
        });
    }

    updateQuestLog(questLog: Map<QuestId, QuestLogItem>) {
        this.setState({ questLog });
    }

    private joystickContainerRef = (div: HTMLDivElement | null) => {
        const { inputManager } = this.props;
        if (div) {
            inputManager.initializeJoystick(div);
        }
    };

    private onKeyDown = (event: KeyboardEvent) => {
        if (event.which === 112) { // F1=112
            event.preventDefault();
            const debug = !this.state.debug;
            this.setState({ debug });
            settings.set('debug', debug);
        } else if (event.which === 13) {
            const chatBox = this.chatBoxInput.current;
            if (chatBox) {
                event.stopPropagation();
                chatBox.focus();
            }
        }
    };

    private initialize(container: HTMLElement) {
        const { canvas } = this.props;

        this.canvas = canvas;
        canvas.addEventListener('contextmenu', this.onContextMenu);
        container.appendChild(canvas);

        const style = (canvas.style as ImageStyle);
        style.position = 'fixed';
        style.imageRendering = 'pixelated';
        style.imageRendering = 'crisp-edges';
        style.imageRendering = '-moz-crisp-edges';

        window.addEventListener('resize', this.updateSize);

        this.updateSize();
    }

    private cleanup() {
        this.canvas!.removeEventListener('contextmenu', this.onContextMenu);
        window.removeEventListener('resize', this.updateSize);
    }

    private containerRef = (container: HTMLElement | null) => {
        if (container) {
            this.initialize(container);
        } else {
            this.cleanup();
        }
    };

    private updateSize = () => {
        const { canvas, setScale } = this.props;

        const devicePixelRatio = window.devicePixelRatio || 1;

        const cssWidth = window.innerWidth;
        const cssHeight = window.innerHeight;

        const width = window.innerWidth * devicePixelRatio;
        const height = window.innerHeight * devicePixelRatio;

        const widthRatio = width / 800;
        const heightRatio = height / 450;

        canvas.style.width = `${cssWidth}px`;
        canvas.style.height = `${cssHeight}px`;

        setScale(width, height, roundScale(Math.max(widthRatio, heightRatio)));
    };

    private onContextMenu = (event: Event) => {
        event.preventDefault();
    };

    private leave = () => {
        this.props.playingNetworkApi.leaveGame();
    };

    private abandonQuest = (questId: QuestId) => {
        this.props.playingNetworkApi.abandonQuest(questId);
    };

    private acceptQuest = (id: QuestId) => {
        this.props.playingNetworkApi.acceptQuest(id);
    };

    private completeQuest = (id: QuestId) => {
        this.props.playingNetworkApi.completeQuest(id);
    };

    private closeInteraction = () => {
        this.props.playingNetworkApi.closeInteraction();
    };

    private sendChatMessage = (message: string) => {
        this.props.playingNetworkApi.sendChatMessage(message);
    };
}

function roundScale(scale: number): number {
    if (scale < 2) {
        return Math.ceil(scale);
    }
    return Math.round(scale * 32) / 32;
}
