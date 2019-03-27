import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { GameScreen } from '../src/components/game/GameScreen';
import { InputManager } from '../src/input/InputManager';
import { FAKE_API, QUEST_LOG, textureLoader } from './SampleData';
import { CharacterState, PlayerState } from '../../common/protocol/PlayerState';
import { QuestLogItem } from '../../common/protocol/QuestLogItem';
import { QuestId } from '../../common/domain/InteractionTable';
import { maxXpFor } from '../../common/algorithms';

function noop() {
}

const canvas = document.createElement('canvas');
const inputManager = new InputManager();

let playerState: PlayerState & { character: CharacterState } = {
    character: {
        xp: 730,
        level: 12,
        name: 'Test',
        sex: 'male',
        classId: 'warrior',
        inventorySize: 10,
    },
    interaction: null,
};
let questLog = QUEST_LOG;

const networkApi = {
    ...FAKE_API,
    sendChatMessage: (message: string) => {
        if (message === 'x') {
            let { xp, level } = playerState.character;

            const maxXp = maxXpFor(level);
            xp += 230;
            if (xp > maxXp) {
                level += 1;
                xp -= maxXp;
            }

            playerState = {
                ...playerState,
                character: {
                    ...playerState.character,
                    level,
                    xp,
                }
            };

            screen.updatePlayerState(playerState);
        } else if (message === 'p') {
            questLog = new Map<QuestId, QuestLogItem>(questLog);
            const questId = 1 as QuestId;
            const questLogItem = questLog.get(questId)!;

            if (questLogItem.status !== 'failed') {
                questLog.set(questId, {
                    ...questLogItem,
                    status: [questLogItem.status[0] + 1, 1, 1]
                });
            }
            screen.updateQuestLog(questLog);
        } else if (message === 'f') {
            questLog = new Map<QuestId, QuestLogItem>(questLog);
            const questId = 5 as QuestId;
            questLog.set(questId, {
                ...questLog.get(questId)!,
                status: 'failed'
            });
            screen.updateQuestLog(questLog);
        }
    }
};

let screen: GameScreen;


function initScreen(gameScreen: GameScreen) {
    screen = gameScreen;

    gameScreen.updateQuestLog(questLog);
    gameScreen.updatePlayerState(playerState);
    gameScreen.chatMessageReceived({ sender: 'John', text: 'Hello there!' });
    gameScreen.chatMessageReceived({ sender: 'John', text: 'What happens, when a very long message is added?' });
    gameScreen.chatMessageReceived({ sender: 'John', text: 'Type: x to add xp, type p to update progress, f to fail!' });
}


storiesOf('Screen/GameScreen', module)
    .add('GameScreen', () => (
        <GameScreen setScale={noop} canvas={canvas} inputManager={inputManager} onMount={initScreen}
                    playingNetworkApi={networkApi} textureLoader={textureLoader}/>
    ));
