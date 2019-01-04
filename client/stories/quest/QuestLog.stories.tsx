import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { QuestLog } from '../../src/components/quest/QuestLog';
import { QuestId } from '../../../common/domain/InteractionTable';
import { QuestLogItem } from '../../../common/protocol/QuestLogItem';
import { PLAYER_LEVEL, QUEST_LOG } from '../SampleData';


function noop() {
}

storiesOf('Quest/QuestLog', module)
    .add('normal', () => (
        <QuestLog playerLevel={PLAYER_LEVEL} questLog={QUEST_LOG} onClose={noop}/>
    ))
    .add('empty', () => (
        <QuestLog playerLevel={PLAYER_LEVEL} questLog={new Map<QuestId, QuestLogItem>()} onClose={noop}/>
    ));
