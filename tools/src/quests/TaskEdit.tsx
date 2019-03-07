import { ItemTask, KillTask, SpellTask, Task, Tasks, VisitAreaTask } from '../../../server/src/quest/Quest';
import { objectEdit, PropertyConfig } from '../components/edit/ObjectEdit';
import { MultilineTextEdit, TextEdit } from '../components/edit/TextEdit';
import { NumberEdit } from '../components/edit/NumberEdit';
import { unionEdit } from '../components/edit/UnionEdit';
import { arrayEdit } from '../components/edit/ArrayEdit';

const BASE_TASK: Pick<Task, 'count'> = {
    count: 1,
};

const DEFAULT_TASK: VisitAreaTask = {
    type: 'visit',
    title: 'Visit area',
    areaName: 'area',
    count: 1,
};

const TASK_PROPERTY_CONFIG: PropertyConfig<Pick<Task, 'title' | 'count'>> = {
    title: { component: TextEdit },
    count: { component: NumberEdit },
};

const TaskEdit = unionEdit<Task>({
    visit: {
        component: () => objectEdit<VisitAreaTask, 'type'>({
            ...TASK_PROPERTY_CONFIG,
            areaName: { component: TextEdit }
        }),
        defaultValue: DEFAULT_TASK,
    },
    item: {
        component: () => objectEdit<ItemTask, 'type'>({
            ...TASK_PROPERTY_CONFIG,
        }),
        defaultValue: { type: 'item', title: 'Bring the item', ...BASE_TASK },
    },
    kill: {
        component: () => objectEdit<KillTask, 'type'>({
            ...TASK_PROPERTY_CONFIG,
            npcIds: { component: arrayEdit<string>('', TextEdit) }
        }),
        defaultValue: { type: 'kill', title: 'Intruders slain', npcIds: [], ...BASE_TASK }
    },
    spell: {
        component: () => objectEdit<SpellTask, 'type'>({
            ...TASK_PROPERTY_CONFIG,
            spellIds: { component: arrayEdit<string>('', TextEdit) }
        }),
        defaultValue: { type: 'spell', title: 'Vegetables tasted', spellIds: [], ...BASE_TASK }
    }
});

export const TasksEdit = objectEdit<Tasks>({
    progress: { component: MultilineTextEdit },
    list: { component: arrayEdit<Task>(DEFAULT_TASK, TaskEdit) }
});
