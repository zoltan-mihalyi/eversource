import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Inventory } from '../../src/components/inventory/Inventory';
import { ItemInfoWithCount, ItemId, ItemQuality, SlotId } from '../../../common/protocol/ItemInfo';
import { Gui } from '../../src/components/common/Gui';
import { times } from '../../src/components/utils';
import TextureLoaderContext from '../../src/components/context/TextureLoaderContext';
import { createEquipmentItem, textureLoader } from '../SampleData';
import { EQUIPMENT_SLOTS } from '../../../common/components/View';

const QUALITIES: ItemQuality[] = ['common', 'rare', 'epic', 'legendary'];
const ITEM_NAMES: { [key: string]: string } = {
    tomato: 'Tomato',
    potato: 'Potato',
    carrot: 'Carrot',
    artichoke: 'Artichoke',
    pepper: 'Pepper',
    squash: 'Squash',
    corn: 'Corn',
};
const ITEM_ANIMATIONS = Object.keys(ITEM_NAMES);

function createItem(): ItemInfoWithCount {
    return {
        itemInfo: {
            id: 123 as ItemId,
            name: 'Legendary Carrot',
            image: 'plants',
            animation: 'carrot',
            quality: 'legendary',
            lore: 'This carrot was enchanted by a wizard.',
            questItem: false,
        },
        count: 1,
    };
}

function createItem2(slotId: number): ItemInfoWithCount {
    const animation = ITEM_ANIMATIONS[slotId % ITEM_ANIMATIONS.length];

    return {
        itemInfo: {
            id: 123 as ItemId,
            name: `Tasty ${ITEM_NAMES[animation]}`,
            image: 'plants',
            animation,
            quality: QUALITIES[slotId % QUALITIES.length],
            questItem: slotId % 3 === 0,
        },
        count: (slotId % 19) + 1,
    };
}

function noop() {
}

storiesOf('Inventory', module)
    .addDecorator((story => (
        <Gui>
            <TextureLoaderContext.Provider value={textureLoader}>
                {story()}
            </TextureLoaderContext.Provider>
        </Gui>
    )))
    .add('empty', () => (
        <Inventory items={[]} slots={16} onClose={noop}/>
    ))
    .add('normal', () => (
        <Inventory items={times(6, createItem)} slots={16} onClose={noop}/>
    ))
    .add('equipment', () => (
        <Inventory items={EQUIPMENT_SLOTS.map(createEquipmentItem)} slots={16} onClose={noop}/>
    ))
    .add('64', () => (
        <Inventory items={times(64, createItem2)} slots={80} onClose={noop}/>
    ));
