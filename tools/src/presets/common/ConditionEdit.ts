import { unionEdit } from '../../components/edit/UnionEdit';
import { Condition, QuestCondition } from '../../../../server/src/Condition';
import { objectEdit } from '../../components/edit/ObjectEdit';
import { QuestIdEdit } from './IdEdits';
import { EmptyEdit } from '../../components/edit/EmptyEdit';
import { QuestId } from '../../../../common/domain/InteractionTable';
import { optionalEdit } from '../../components/edit/OptionalEdit';

export const ConditionEdit = unionEdit<Condition>({
    quest: {
        component: () => objectEdit<QuestCondition, 'type'>({
            questId: { component: QuestIdEdit },
        }),
        defaultValue: { type: 'quest', questId: 1 as QuestId },
    },
    task: {
        component: () => EmptyEdit,
        defaultValue: { type: 'task' },
    },
});

export const OptionalConditionEdit = optionalEdit<Condition, undefined>({ type: 'task' }, ConditionEdit, void 0);