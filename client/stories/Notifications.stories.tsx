import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Notifications } from '../src/components/game/notification/Notifications';
import { Gui } from '../src/components/common/Gui';
import { Positioned } from '../src/components/common/Positioned';
import { brown } from '../src/components/theme';
import { NotificationText } from '../src/components/game/notification/NotificationText';

const notifications = React.createRef<any>();

function addNotification() {
    notifications.current!.add(<NotificationText color={brown.lighter}>Hello! {Math.floor(Math.random() * 1000)}</NotificationText>);
}

storiesOf('Notifications', module)
    .addDecorator((story) => (
        <Gui>{story()}</Gui>
    ))
    .add('Simple', () => (
        <Positioned horizontal="stretch" vertical="top">
            <button onClick={addNotification}>Add</button>
            <Notifications ref={notifications} maxRows={3} timeInMs={2000}/>
        </Positioned>
    ));
