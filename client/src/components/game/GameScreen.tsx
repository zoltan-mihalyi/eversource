import * as React from 'react';
import { PlayingNetworkApi } from '../../protocol/PlayingState';
import { QuestId } from '../../../../common/domain/InteractionTable';
import { InteractionDialog } from '../quest/InteractionDialog';
import { CharacterState, PlayerState } from '../../../../common/protocol/PlayerState';
import { QuestLogItem } from '../../../../common/protocol/QuestLogItem';
import { GameMenu } from './GameMenu';
import { DebugInfo } from '../gui/DebugInfo';
import { settings } from '../../settings/SettingsStore';
import { InputManager } from '../../input/InputManager';
import { XpBar } from './XpBar';
import { maxXpFor } from '../../../../common/algorithms';
import { Gui } from '../common/Gui';
import { EntityId } from '../../../../common/es/Entity';

const EMPTY_CHARACTER: CharacterState = {
    level: 1,
    xp: 0,
    id: 0 as EntityId,
};

interface Props {
    setScale: (width: number, height: number, scale: number) => void;
    inputManager: InputManager;
    canvas: HTMLCanvasElement;
    onMount: (gameScreen: GameScreen) => void;
    playingNetworkApi: PlayingNetworkApi;
}

interface State {
    playerState: PlayerState;
    questLog: Map<QuestId, QuestLogItem>;
    debug: boolean;
}

interface ImageStyle extends CSSStyleDeclaration {
    imageRendering: string;
}

export class GameScreen extends React.Component<Props, State> {
    private canvas: HTMLCanvasElement | null = null;

    state: State = {
        playerState: { interaction: null, character: null },
        questLog: new Map<QuestId, QuestLogItem>(),
        debug: settings.get('debug') || false,
    };

    render() {
        const { playerState: { interaction, character }, questLog, debug } = this.state;

        const displayCharacter = character || EMPTY_CHARACTER;

        return (
            <Gui>
                <div ref={this.containerRef}/>
                {debug && <DebugInfo/>}
                {interaction && <InteractionDialog interactions={interaction} onAcceptQuest={this.acceptQuest}
                                                   onCompleteQuest={this.completeQuest}
                                                   onClose={this.closeInteraction}/>}

                <div ref={this.joystickContainerRef}/>
                <GameMenu playerLevel={displayCharacter.level} questLog={questLog}
                          onLeave={this.leave}/>
                <XpBar level={displayCharacter.level} xp={displayCharacter.xp}
                       maxXp={maxXpFor(displayCharacter.level)}/>
            </Gui>
        );
    }

    componentDidMount() {
        this.props.onMount(this);
        document.body.addEventListener('keydown', this.onKeyDown);
    }

    componentWillUnmount() {
        document.body.removeEventListener('keydown', this.onKeyDown);
    }

    updatePlayerState(playerState: PlayerState) { // TODO interface
        this.setState({ playerState });
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

    private acceptQuest = (id: QuestId) => {
        this.props.playingNetworkApi.acceptQuest(id);
    };

    private completeQuest = (id: QuestId) => {
        this.props.playingNetworkApi.completeQuest(id);
    };

    private closeInteraction = () => {
        this.props.playingNetworkApi.closeInteraction();
    };
}

function roundScale(scale: number): number {
    if (scale < 2) {
        return Math.ceil(scale);
    }
    return Math.round(scale * 32) / 32;
}
