import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { QuestInteractionTable } from '../../src/components/quest/QuestInteractionTable';
import { questInfo } from '../SampleData';
import { QuestItemState } from '../../src/components/quest/QuestItemState';
import { Dialog } from '../../src/components/common/Dialog';
import { Gui } from '../../src/components/common/Gui';

function noop() {
}

storiesOf('Quest/QuestInteractionTable', module)
    .addDecorator((story => (
        <Gui>
            <Dialog title="Knight" onClose={noop}>
                {story()}
            </Dialog>
        </Gui>
    )))
    .add('normal', () => (
        <QuestInteractionTable info={questInfo(1, 'Quest info')} state={QuestItemState.ACCEPTABLE} onBack={noop}
                               onAccept={noop}
                               onComplete={noop}/>
    ));
