import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Gui } from '../../src/components/common/Gui';
import TextureLoaderContext from '../../src/components/context/TextureLoaderContext';
import { createEquipmentItem, textureLoader } from '../SampleData';
import { EquipmentSlotId } from '../../../common/domain/CharacterInfo';
import { EquipmentDialog } from '../../src/components/equipment/EquipmentDialog';
import { ItemInfo, ItemInfoWithCount } from '../../../common/protocol/ItemInfo';

const NORMAL = new Map<EquipmentSlotId, ItemInfoWithCount>();
NORMAL.set('head', createEquipmentItem('head'));

function noop() {
}

storiesOf('Equipment', module)
    .addDecorator((story => (
        <Gui>
            <TextureLoaderContext.Provider value={textureLoader}>
                {story()}
            </TextureLoaderContext.Provider>
        </Gui>
    )))
    .add('empty', () => (
        <EquipmentDialog equipment={new Map<EquipmentSlotId, ItemInfoWithCount>()} onClose={noop} onUnequip={noop}/>
    ))
    .add('normal', () => (
        <EquipmentDialog equipment={NORMAL} onClose={noop} onUnequip={noop}/>
    ));

