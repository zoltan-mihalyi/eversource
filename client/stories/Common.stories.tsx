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
import { Centered } from '../src/components/common/Centered';
import { TextListItem } from '../src/components/common/List/TextListItem';
import { Checkbox } from '../src/components/common/Input/Checkbox';

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
    .add('Checkbox', () => (
        <Panel padding>
            <div>
                <Checkbox checked={true} onChange={noop}>Remember password</Checkbox>
            </div>
            <div>
                <Checkbox checked={false} onChange={noop}>Accept conditions</Checkbox>
            </div>
            <div>
                <Checkbox checked={true} disabled={true} onChange={noop}>Disabled</Checkbox>
            </div>
        </Panel>
    ))
    .add('List', () => (
        <Panel>
            <Scrollable>
                <List>
                    <ListItem>Normal item</ListItem>
                    <ListItem selected>Selected item</ListItem>
                    <ListItem>Normal item</ListItem>
                    <ListItem>Normal item</ListItem>
                </List>
            </Scrollable>
        </Panel>
    ))
    .add('Bordered List', () => (
        <Panel>
            <Scrollable>
                <List bordered>
                    <ListItem>Normal item</ListItem>
                    <ListItem selected>Selected item</ListItem>
                    <ListItem>Normal item</ListItem>
                    <ListItem>Normal item</ListItem>
                </List>
            </Scrollable>
        </Panel>
    ))
    .add('TextList', () => (
        <Panel>
            <Scrollable>
                <List>
                    <TextListItem>Normal item</TextListItem>
                    <TextListItem selected>Selected item</TextListItem>
                    <TextListItem level="lowest">Lowest level</TextListItem>
                    <TextListItem level="lower">Lower level</TextListItem>
                    <TextListItem level="normal">Normal level</TextListItem>
                    <TextListItem level="higher">Higher level</TextListItem>
                    <TextListItem level="highest">Highest level</TextListItem>
                    <TextListItem>Item with a very very long name</TextListItem>
                </List>
            </Scrollable>
        </Panel>
    ))
    .add('Panel', () => (
        <Panel>
            Content
        </Panel>
    ))
    .add('Centered', () => (
        <Centered>
            <Panel>
                Content
            </Panel>
        </Centered>
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
