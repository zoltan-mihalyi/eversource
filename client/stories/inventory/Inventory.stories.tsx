import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Inventory } from '../../src/components/inventory/Inventory';
import { ItemId, ItemInfoWithCount, ItemQuality, SlotId } from '../../../common/protocol/ItemInfo';
import { Gui } from '../../src/components/common/Gui';
import { times } from '../../src/components/utils';
import TextureLoaderContext from '../../src/components/context/TextureLoaderContext';
import { createEquipmentItem, createItem, textureLoader } from '../SampleData';
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
        <Inventory items={inventoryMap([])} slots={16} onClose={noop} onEquip={noop}/>
    ))
    .add('normal', () => (
        <Inventory items={inventoryMap(times(6, createItem))} slots={16} onClose={noop} onEquip={noop}/>
    ))
    .add('equipment', () => (
        <Inventory items={inventoryMap(EQUIPMENT_SLOTS.map(createEquipmentItem))} slots={16} onClose={noop} onEquip={noop}/>
    ))
    .add('64', () => (
        <Inventory items={inventoryMap(times(64, createItem2))} slots={80} onClose={noop} onEquip={noop}/>
    ));

function inventoryMap(items: ItemInfoWithCount[]): Map<SlotId, ItemInfoWithCount> {
    const result = new Map<SlotId, ItemInfoWithCount>();
    let nextSlotId = 0;
    for (const item of items) {
        result.set(nextSlotId++ as SlotId, item);
    }
    return result;
}