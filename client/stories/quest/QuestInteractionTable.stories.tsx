import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { QuestInteractionTable } from '../../src/components/quest/QuestInteractionTable';
import { CHARACTER_STATE, questInfo } from '../SampleData';
import { QuestItemState } from '../../src/components/quest/QuestItemState';
import { Dialog } from '../../src/components/common/Dialog';
import { Gui } from '../../src/components/common/Gui';
import CharacterContext from '../../src/components/CharacterContext';

function noop() {
}

storiesOf('Quest/QuestInteractionTable', module)
    .addDecorator((story => (
        <Gui>
            <CharacterContext.Provider value={CHARACTER_STATE}>
                <Dialog title="Knight" onClose={noop}>
                    {story()}
                </Dialog>
            </CharacterContext.Provider>
        </Gui>
    )))
    .add('normal', () => (
        <QuestInteractionTable info={questInfo(1, 'Quest info')} state={QuestItemState.ACCEPTABLE} onBack={noop}
                               onAccept={noop}
                               onComplete={noop}/>
    ));
