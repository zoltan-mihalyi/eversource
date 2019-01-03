import { storiesOf } from '@storybook/react';
import { Gui } from '../src/components/common/Gui';
import { Scrollable } from '../src/components/common/Scrollable';
import { InteractionItemButton } from '../src/components/common/Button/InteractionItemButton';
import * as React from 'react';
import { ActionButton } from '../src/components/common/Button/ActionButton';
import { Input } from '../src/components/common/Input';
import { List } from '../src/components/common/List';
import { ListItem } from '../src/components/common/List/ListItem';
import { Panel } from '../src/components/common/Panel';
import { Dialog } from '../src/components/common/Dialog';
import { Positioned } from '../src/components/common/Positioned';

function noop() {
}

storiesOf('Common', module)
    .addDecorator((story => (
        <Gui>
            {story()}
        </Gui>
    )))
    .add('ActionButton', () => (
        <ActionButton onClick={() => alert('clicked')}>Click me!</ActionButton>
    ))
    .add('InteractionItemButton', () => (
        <Scrollable variant="paper" fixedHeight padding>
            <InteractionItemButton onClick={() => alert('clicked')}>Click me!</InteractionItemButton>
            <InteractionItemButton onClick={() => alert('clicked')}>Click me!</InteractionItemButton>
        </Scrollable>
    ))
    .add('Input', () => (
        <Input value={"test"} onChange={noop}/>
    ))
    .add('List', () => (
        <Panel>
            <Scrollable>
                <List>
                    <ListItem>Normal item</ListItem>
                    <ListItem level="lowest">Lowest level</ListItem>
                    <ListItem level="lower">Lower level</ListItem>
                    <ListItem level="normal">Normal level</ListItem>
                    <ListItem level="higher">Higher level</ListItem>
                    <ListItem level="highest">Highest level</ListItem>
                    <ListItem>Item with a very very long name</ListItem>
                </List>
            </Scrollable>
        </Panel>
    ))
    .add('Panel', () => (
        <Panel>
            Content
        </Panel>
    ))
    .add('Dialog', () => (
        <Dialog title="Test dialog" onClose={noop}>
            Content
        </Dialog>
    ))
    .add('Positioned', () => (
        <>
            <Positioned horizontal="left" vertical="top">Top left</Positioned>
            <Positioned horizontal="right" vertical="top">Top right</Positioned>
            <Positioned horizontal="left" vertical="bottom">Bottom left</Positioned>
            <Positioned horizontal="right" vertical="bottom">Bottom left</Positioned>
        </>
    ));
