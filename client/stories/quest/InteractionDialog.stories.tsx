import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { CHARACTER_STATE, INTERACTIONS } from '../SampleData';
import { Gui } from '../../src/components/common/Gui';
import { InteractionDialog } from '../../src/components/quest/InteractionDialog';
import CharacterContext from '../../src/components/CharacterContext';

function noop() {
}

storiesOf('Quest/InteractionDialog', module)
    .addDecorator((story => (
        <Gui>
            <CharacterContext.Provider value={CHARACTER_STATE}>
                {story()}
            </CharacterContext.Provider>
        </Gui>
    )))
    .add('normal', () => (
        <InteractionDialog interactions={INTERACTIONS} onClose={noop} onAcceptQuest={noop}
                           onCompleteQuest={noop}/>
    ));
