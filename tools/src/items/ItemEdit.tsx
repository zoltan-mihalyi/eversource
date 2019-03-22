import * as React from 'react';
import { objectEdit } from '../components/edit/ObjectEdit';
import { TextEdit } from '../components/edit/TextEdit';
import { PresetItem } from '../../../server/src/Item';
import { optionEdit } from '../components/edit/OptionEdit';
import { optionalEdit } from '../components/edit/OptionalEdit';
import { QuestId } from '../../../common/domain/InteractionTable';
import { NumberEdit } from '../components/edit/NumberEdit';
import { QuestIdEdit } from '../presets/common/IdEdits';

export const ItemEdit = objectEdit<PresetItem>({
    name: { component: TextEdit },
    image: { component: TextEdit },
    animation: { component: TextEdit },
    quality: { component: optionEdit(['common', 'rare', 'epic', 'legendary']) },
    stackSize: { component: optionalEdit(0, NumberEdit, void 0) },
    questId: { component: optionalEdit(0 as QuestId, QuestIdEdit, void 0) },
    lore: { component: optionalEdit('', TextEdit, void 0) }
});
