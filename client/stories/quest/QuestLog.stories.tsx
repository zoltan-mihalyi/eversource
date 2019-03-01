import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { QuestLog } from '../../src/components/quest/QuestLog';
import { QuestId } from '../../../common/domain/InteractionTable';
import { QuestLogItem } from '../../../common/protocol/QuestLogItem';
import { CHARACTER_STATE, QUEST_LOG } from '../SampleData';
import { Gui } from '../../src/components/common/Gui';
import CharacterContext from '../../src/components/CharacterContext';


function noop() {
}

storiesOf('Quest/QuestLog', module)
    .addDecorator(story => (
        <Gui>
            <CharacterContext.Provider value={CHARACTER_STATE}>
                {story()}
            </CharacterContext.Provider>
        </Gui>
    ))
    .add('normal', () => (
        <QuestLog questLog={QUEST_LOG} onClose={noop} onAbandonQuest={noop}/>
    ))
    .add('empty', () => (
        <QuestLog questLog={new Map<QuestId, QuestLogItem>()} onClose={noop} onAbandonQuest={noop}/>
    ));
