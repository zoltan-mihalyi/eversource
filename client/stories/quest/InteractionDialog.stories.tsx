import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { CHARACTER_STATE, INTERACTIONS, textureLoader } from '../SampleData';
import { Gui } from '../../src/components/common/Gui';
import { InteractionDialog } from '../../src/components/quest/InteractionDialog';
import CharacterContext from '../../src/components/context/CharacterContext';
import TextureLoaderContext from '../../src/components/context/TextureLoaderContext';

function noop() {
}

storiesOf('Quest/InteractionDialog', module)
    .addDecorator((story => (
        <Gui>
            <TextureLoaderContext.Provider value={textureLoader}>
                <CharacterContext.Provider value={CHARACTER_STATE}>
                    {story()}
                </CharacterContext.Provider>
            </TextureLoaderContext.Provider>
        </Gui>
    )))
    .add('normal', () => (
        <InteractionDialog interactions={INTERACTIONS} onClose={noop} onAcceptQuest={noop}
                           onCompleteQuest={noop}/>
    ));
