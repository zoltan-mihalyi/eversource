import { objectEdit } from '../../components/edit/ObjectEdit';
import { LootElement } from '../../../../server/src/world/Presets';
import { NumberEdit } from '../../components/edit/NumberEdit';
import { ItemIdEdit } from '../common/IdEdits';

export const LootElementEdit = objectEdit<LootElement>({
    minCount: { component: NumberEdit },
    maxCount: { component: NumberEdit },
    chance: { component: NumberEdit },
    itemId: { component: ItemIdEdit },
});