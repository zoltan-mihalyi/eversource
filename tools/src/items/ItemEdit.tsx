import * as React from 'react';
import { objectEdit } from '../components/edit/ObjectEdit';
import { TextEdit } from '../components/edit/TextEdit';
import { ItemEquip, PresetItem } from '../../../server/src/Item';
import { optionEdit } from '../components/edit/OptionEdit';
import { optionalEdit } from '../components/edit/OptionalEdit';
import { QuestId } from '../../../common/domain/InteractionTable';
import { NumberEdit } from '../components/edit/NumberEdit';
import { QuestIdEdit } from '../presets/common/IdEdits';
import { OptionalConditionEdit } from '../presets/common/ConditionEdit';
import { arrayEdit } from '../components/edit/ArrayEdit';
import { EditComponent } from '../components/edit/Edit';

const DEFAULT_EQUIP: ItemEquip = {
    slotId: 'head',
    image: ['legion1'],
};

const SlotIdEdit = optionEdit(['shirt', 'head', 'cape', 'belt', 'arms', 'chest', 'legs', 'hands', 'feet']);

const EquipEdit = objectEdit<ItemEquip, never>({
    slotId: { component: SlotIdEdit },
    image: { component: arrayEdit('', TextEdit) as EditComponent<any> },
});


export const ItemEdit = objectEdit<PresetItem>({
    name: { component: TextEdit },
    image: { component: TextEdit },
    animation: { component: TextEdit },
    quality: { component: optionEdit(['common', 'rare', 'epic', 'legendary']) },
    stackSize: { component: optionalEdit(0, NumberEdit, void 0) },
    equip: { component: optionalEdit(DEFAULT_EQUIP, EquipEdit, void 0) },
    questId: { component: optionalEdit(0 as QuestId, QuestIdEdit, void 0) },
    condition: { component: OptionalConditionEdit },
    lore: { component: optionalEdit('', TextEdit, void 0) },
});
