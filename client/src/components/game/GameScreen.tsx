import * as React from 'react';
import { GameApplication } from '../../map/GameApplication';
import { PlayingNetworkApi } from '../../protocol/PlayingState';
import { QuestId } from '../../../../common/domain/InteractionTable';
import { InteractionDialog } from '../quest/InteractionDialog';
import { PlayerState } from '../../../../common/protocol/PlayerState';
import { QuestLogItem } from '../../../../common/protocol/QuestLogItem';
import { Diff } from '../../../../common/protocol/Diff';
import { GameMenu } from './GameMenu';
import { DebugInfo } from '../gui/DebugInfo';
import { settings } from '../../settings/SettingsStore';

interface Props {
    game: GameApplication;
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

        return (
            <div>
                <div ref={this.containerRef}/>
                {debug && <DebugInfo/>}
                {interaction && <InteractionDialog interactions={interaction} onAcceptQuest={this.acceptQuest}
                                                   onCompleteQuest={this.completeQuest}
                                                   onClose={this.closeInteraction}/>}

                <div ref={this.joystickContainerRef}/>
                <GameMenu playerLevel={character === null ? 1 : character.level} questLog={questLog}
                          onLeave={this.leave}/>
            </div>
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

    updateQuestLog(diffs: Diff<QuestId, QuestLogItem>[]) {
        const oldQuestLog = this.state.questLog;
        const questLog = new Map(oldQuestLog);

        for (const diff of diffs) {
            switch (diff.type) {
                case 'create':
                    questLog.set(diff.id, diff.data);
                    break;
                case 'change':
                    questLog.set(diff.id, { ...questLog.get(diff.id)!, ...diff.changes });
                    break;
                case 'remove':
                    questLog.delete(diff.id);
            }
        }

        this.setState({
            questLog,
        });
    }

    private joystickContainerRef = (div: HTMLDivElement | null) => {
        const { inputManager } = this.props.game;
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
        const { game } = this.props;

        const canvas = game.view;
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
        const { game } = this.props;
        const canvas = game.view;

        const devicePixelRatio = window.devicePixelRatio || 1;

        const cssWidth = window.innerWidth;
        const cssHeight = window.innerHeight;

        const width = window.innerWidth * devicePixelRatio;
        const height = window.innerHeight * devicePixelRatio;

        const widthRatio = width / 800;
        const heightRatio = height / 450;

        game.setScale(roundScale(Math.max(widthRatio, heightRatio)));

        canvas.style.width = `${cssWidth}px`;
        canvas.style.height = `${cssHeight}px`;

        game.renderer.resize(width, height);
        game.updateView();
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