import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { INTERACTIONS } from '../SampleData';
import { Gui } from '../../src/components/common/Gui';
import { InteractionDialog } from '../../src/components/quest/InteractionDialog';

function noop() {
}

storiesOf('Quest/InteractionDialog', module)
    .addDecorator((story => (
        <Gui>{story()}</Gui>
    )))
    .add('normal', () => (
        <InteractionDialog interactions={INTERACTIONS} onClose={noop} onAcceptQuest={noop} onCompleteQuest={noop}/>
    ));
