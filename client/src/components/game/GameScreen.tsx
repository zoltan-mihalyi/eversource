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
import CharacterContext, { EMPTY_CHARACTER } from '../context/CharacterContext';
import { ChatBox, MessageEntry } from '../chat/ChatBox';
import { Positioned } from '../common/Positioned';
import { Action, ChatMessage, FailedAction, QuestStatusAction } from '../../../../common/protocol/Messages';
import { ItemInfoWithCount, SlotId } from '../../../../common/protocol/ItemInfo';
import { TextureLoader } from '../../loader/TextureLoader';
import TextureLoaderContext from '../context/TextureLoaderContext';
import { Notifications } from './notification/Notifications';
import { level, quest, red, xp } from '../theme';
import { isComplete } from '../quest/QuestLog';
import { NotificationText } from './notification/NotificationText';
import { EquipmentSlotId } from '../../../../common/domain/CharacterInfo';
import { playSoundEffect } from '../../systems/AudioSystem';

const MAX_MESSAGES = 100;

interface Props {
    setScale: (width: number, height: number, scale: number) => void;
    inputManager: InputManager;
    canvas: HTMLCanvasElement;
    onMount: (gameScreen: GameScreen) => void;
    playingNetworkApi: PlayingNetworkApi;
    textureLoader: TextureLoader;
}

interface State {
    messages: MessageEntry[];
    playerState: PlayerState;
    inventory: Map<SlotId, ItemInfoWithCount>;
    equipment: Map<EquipmentSlotId, ItemInfoWithCount>;
    questLog: Map<QuestId, QuestLogItem>;
    debug: boolean;
}

interface ImageStyle extends CSSStyleDeclaration {
    imageRendering: string;
}

export class GameScreen extends React.Component<Props, State> {
    private canvas: HTMLCanvasElement | null = null;
    private chatBoxInput = React.createRef<HTMLInputElement>();
    private notifications = React.createRef<Notifications>();

    state: State = {
        messages: [],
        playerState: { interaction: null, character: null },
        inventory: new Map<SlotId, ItemInfoWithCount>(),
        equipment: new Map<EquipmentSlotId, ItemInfoWithCount>(),
        questLog: new Map<QuestId, QuestLogItem>(),
        debug: settings.get('debug') || false,
    };

    render() {
        const { textureLoader } = this.props;
        const { playerState: { interaction, character }, inventory, equipment, questLog, debug } = this.state;

        const displayCharacter = character || EMPTY_CHARACTER;

        return (
            <Gui>
                <TextureLoaderContext.Provider value={textureLoader}>
                    <CharacterContext.Provider value={displayCharacter}>
                        <div ref={this.containerRef}/>

                        <Positioned horizontal="left" vertical="bottom">
                            <ChatBox inputRef={this.chatBoxInput} sendMessage={this.sendChatMessage}
                                     messages={this.state.messages}/>
                        </Positioned>
                        <Positioned horizontal="stretch" vertical="top">
                            <Notifications ref={this.notifications} maxRows={3} timeInMs={4000}/>
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
                        <GameMenu character={displayCharacter} questLog={questLog} inventory={inventory}
                                  equipment={equipment}
                                  onLeave={this.leave} onAbandonQuest={this.abandonQuest} onEquip={this.equip}
                                  onUnequip={this.unequip}/>
                    </CharacterContext.Provider>
                </TextureLoaderContext.Provider>
            </Gui>
        );
    }

    componentDidMount() {
        this.props.onMount(this);
        document.body.addEventListener('keydown', this.onKeyDown);
        document.body.addEventListener('keypress', this.onKeyPress);
    }

    componentWillUnmount() {
        document.body.removeEventListener('keydown', this.onKeyDown);
        document.body.removeEventListener('keypress', this.onKeyPress);
    }

    updatePlayerState(playerState: PlayerState) { // TODO interface
        const { character } = this.state.playerState;
        if (character && playerState.character) {
            this.addCharacterNotifications(character, playerState.character);
        }

        this.setState({ playerState });
    }

    chatMessageReceived(message: ChatMessage) {
        this.addMessageEntry({
            type: 'chat',
            message,
        });
    }

    updateQuestLog(questLog: Map<QuestId, QuestLogItem>) {
        this.state.questLog.forEach((questLogItem, questId) => {
            const newQuestLogItem = questLog.get(questId);
            if (!newQuestLogItem || newQuestLogItem.status === questLogItem.status) {
                return;
            }

            this.addQuestLogItemChangeNotifications(questLogItem, newQuestLogItem);
        });

        this.setState({ questLog });
    }

    updateInventory(inventory: Map<SlotId, ItemInfoWithCount>) {
        this.setState({ inventory });
    }

    updateEquipment(equipment: Map<EquipmentSlotId, ItemInfoWithCount>) {
        this.setState({ equipment });
    }

    action(action: Action) {
        switch (action.type) {
            case 'failed':
                this.addFailedActionNotification(action);
                break;
            case 'inventory':
                this.addMessageEntry(action);
                break;
            case 'quest-status':
                this.addMessageEntry(action);
                playQuestStatusSound(action);
        }
    }

    private addFailedActionNotification(action: FailedAction) {
        switch (action.actionType) {
            case 'too-far-away':
                this.addSimpleNotification('Too far away!', red.normal);
                break;
            case 'no-reward-selected':
                this.addSimpleNotification('No reward selected!', red.normal);
        }
    }

    private addMessageEntry(messageEntry: MessageEntry) {
        this.setState((state) => {
            const messages = [...state.messages, messageEntry];
            if (messages.length > MAX_MESSAGES) {
                messages.shift();
            }

            return {
                messages,
            };
        });
    }

    private addQuestLogItemChangeNotifications(questLogItem: QuestLogItem, newQuestLogItem: QuestLogItem) {
        if (newQuestLogItem.status === 'failed') {
            this.addSimpleNotification(`${newQuestLogItem.info.name} failed.`, red.normal);
        } else if (questLogItem.status !== 'failed') {
            for (let i = 0; i < newQuestLogItem.status.length; i++) {
                const taskStatus = newQuestLogItem.status[i];
                if (taskStatus === questLogItem.status[i]) {
                    continue;
                }
                const taskInfo = newQuestLogItem.info.tasks[i];
                if (!taskInfo.track) {
                    continue;
                }
                this.addSimpleNotification(`${taskInfo.track.title} ${taskStatus}/${taskInfo.count}`, quest.active);
            }
        }

        if (isComplete(newQuestLogItem)) {
            this.addSimpleNotification(`✓ ${newQuestLogItem.info.name}`, quest.active);
        }
    }

    private addCharacterNotifications(prevCharacter: CharacterState, character: CharacterState) {
        if (character === prevCharacter) {
            return;
        }

        if (character.xp !== prevCharacter.xp) {
            let xpGain = -prevCharacter.xp;
            let level = prevCharacter.level;
            while (level < character.level) {
                xpGain += maxXpFor(level);
                level++;
            }
            xpGain += character.xp;
            this.addSimpleNotification(`${xpGain} XP`, xp.bright);
        }

        if (character.level !== prevCharacter.level) {
            this.addSimpleNotification(`Level ${character.level} reached!`, level.higher);
        }
    }

    private addSimpleNotification(text: string, color: string) {
        this.notifications.current!.add(
            <NotificationText color={color}>{text}</NotificationText>
        );
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

    private onKeyPress = (event: KeyboardEvent) => {
        if (event.which === 13) {
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

    private completeQuest = (id: QuestId, selectedRewards: number[]) => {
        this.props.playingNetworkApi.completeQuest(id, selectedRewards);
    };

    private closeInteraction = () => {
        this.props.playingNetworkApi.closeInteraction();
    };

    private sendChatMessage = (message: string) => {
        this.props.playingNetworkApi.sendChatMessage(message);
    };

    private equip = (slotId: SlotId, equipmentSlotId: EquipmentSlotId) => {
        this.props.playingNetworkApi.equip(slotId, equipmentSlotId);
    };

    private unequip = (equipmentSlotId: EquipmentSlotId) => {
        this.props.playingNetworkApi.unequip(equipmentSlotId);
    };
}

function roundScale(scale: number): number {
    if (scale < 2) {
        return Math.ceil(scale);
    }
    return Math.round(scale * 32) / 32;
}

function playQuestStatusSound(action: QuestStatusAction) {
    switch (action.actionType) {
        case 'accepted':
            playSoundEffect('quest-accept');
            break;
        case 'abandoned':
            playSoundEffect('quest-abandon');
            break;
        case 'completed':
            playSoundEffect('quest-done');
            break;
    }
}
