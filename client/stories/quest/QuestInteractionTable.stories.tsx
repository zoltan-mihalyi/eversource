import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { QuestInteractionTable } from '../../src/components/quest/QuestInteractionTable';
import { CHARACTER_STATE, ITEM_INFO, questInfo, textureLoader } from '../SampleData';
import { QuestItemState } from '../../src/components/quest/QuestItemState';
import { Dialog } from '../../src/components/common/Dialog';
import { Gui } from '../../src/components/common/Gui';
import CharacterContext from '../../src/components/context/CharacterContext';
import { RewardOptionsInfo } from '../../../common/domain/InteractionTable';
import TextureLoaderContext from '../../src/components/context/TextureLoaderContext';

const REWARDS: RewardOptionsInfo[] = [{
    options: [{
        type: 'item',
        itemInfo: {
            ...ITEM_INFO,
            name: 'Legion helmet',
            equip:{
                slotId: 'head'
            },
            image: 'equipment1',
            animation: 'legion-helmet-1-gold',
            questItem: false,
            lore: 'A rare helmet',
        },
        count: 1
    }]
},{
    options: [{
        type: 'item',
        itemInfo: {
            ...ITEM_INFO,
            name: 'Legion helmet',
            equip:{
                slotId: 'head'
            },
            image: 'equipment1',
            animation: 'legion-helmet-1-gold',
            questItem: false,
            lore: 'A rare helmet',
        },
        count: 1
    }]
}, {
    options: [{
        type: 'item',
        itemInfo: {
            ...ITEM_INFO,

            name: 'Carrot',
            image: 'plants',
            animation: 'carrot',
            questItem: false,
            quality: 'common',
            lore: void 0,
        },
        count: 5
    }, {
        type: 'item',
        itemInfo: {
            ...ITEM_INFO,
            name: 'Potato',
            image: 'plants',
            animation: 'potato',
            questItem: false,
            quality: 'common',
            lore: void 0,
        },
        count: 5
    }, {
        type: 'item',
        itemInfo: {
            ...ITEM_INFO,
            name: 'Corn',
            image: 'plants',
            animation: 'corn',
            questItem: false,
            lore: void 0,
        },
        count: 1
    }, {
        type: 'item',
        itemInfo: {
            ...ITEM_INFO,
            name: 'Tomato',
            image: 'plants',
            animation: 'tomato',
            questItem: false,
            quality: 'common',
            lore: void 0,
        },
        count: 1
    }]
}];

function noop() {
}

storiesOf('Quest/QuestInteractionTable', module)
    .addDecorator((story => (
        <Gui>
            <TextureLoaderContext.Provider value={textureLoader}>
                <CharacterContext.Provider value={CHARACTER_STATE}>
                    <Dialog title="Knight" onClose={noop}>
                        {story()}
                    </Dialog>
                </CharacterContext.Provider>
            </TextureLoaderContext.Provider>
        </Gui>
    )))
    .add('normal', () => (
        <QuestInteractionTable info={questInfo(1, 'Quest info')} state={QuestItemState.ACCEPTABLE} onBack={noop}
                               onAccept={noop}
                               onComplete={noop}/>
    ))
    .add('rewards', () => (
        <QuestInteractionTable info={questInfo(1, 'Quest info', { rewards: REWARDS })} state={QuestItemState.ACCEPTABLE} onBack={noop}
                               onAccept={noop}
                               onComplete={noop}/>
    ));
