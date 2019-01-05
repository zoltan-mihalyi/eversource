import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { QuestInteractionTable } from '../../src/components/quest/QuestInteractionTable';
import { questInfo } from '../SampleData';
import { QuestItemState } from '../../src/components/quest/QuestItemState';
import { Dialog } from '../../src/components/common/Dialog';

function noop() {
}

storiesOf('Quest/QuestInteractionTable', module)
    .addDecorator((story => (
        <Dialog title="Knight" onClose={noop}>
            {story()}
        </Dialog>
    )))
    .add('normal', () => (
        <QuestInteractionTable info={questInfo(1, 'Quest info')} state={QuestItemState.ACCEPTABLE} onBack={noop} onAccept={noop}
                               onComplete={noop}/>
    ));
