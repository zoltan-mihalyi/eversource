import {
    ItemRequirement,
    KillTask,
    QuestRequirement,
    SpellTask,
    Task,
    Tasks,
    VisitAreaTask,
} from '../../../server/src/quest/Quest';
import { objectEdit, PropertyConfig } from '../components/edit/ObjectEdit';
import { MultilineTextEdit, TextEdit } from '../components/edit/TextEdit';
import { NumberEdit } from '../components/edit/NumberEdit';
import { unionEdit } from '../components/edit/UnionEdit';
import { arrayEdit } from '../components/edit/ArrayEdit';
import { ItemId } from '../../../common/protocol/Inventory';
import { optionalEdit } from '../components/edit/OptionalEdit';
import { TaskTrack } from '../../../common/domain/InteractionTable';
import { ItemIdEdit } from '../presets/common/IdEdits';

const BASE_TASK: Pick<Task, 'count'> = {
    count: 1,
};

const DEFAULT_TASK: VisitAreaTask = {
    type: 'visit',
    track: { title: 'Visit area' },
    areaName: 'area',
    count: 1,
};

const DEFAULT_REQUIREMENT: ItemRequirement = {
    type: 'item',
    track: { title: 'Magic Mushroom' },
    itemId: 0 as ItemId,
    count: 1,
};

const DEFAULT_TRACK: TaskTrack = {
    title: 'Intruders slain',
};

const TrackEdit = optionalEdit<TaskTrack, undefined>(DEFAULT_TRACK, objectEdit({
    title: { component: TextEdit },
}), void 0);

const TASK_PROPERTY_CONFIG: PropertyConfig<Pick<Task, 'track' | 'count'>> = {
    track: { component: TrackEdit },
    count: { component: NumberEdit },
};

const TaskEdit = unionEdit<Task>({
    visit: {
        component: () => objectEdit<VisitAreaTask, 'type'>({
            ...TASK_PROPERTY_CONFIG,
            areaName: { component: TextEdit },
        }),
        defaultValue: DEFAULT_TASK,
    },
    kill: {
        component: () => objectEdit<KillTask, 'type'>({
            ...TASK_PROPERTY_CONFIG,
            npcIds: { component: arrayEdit<string>('', TextEdit) },
        }),
        defaultValue: { type: 'kill', track: DEFAULT_TRACK , npcIds: [], ...BASE_TASK },
    },
    spell: {
        component: () => objectEdit<SpellTask, 'type'>({
            ...TASK_PROPERTY_CONFIG,
            spellIds: { component: arrayEdit<string>('', TextEdit) },
        }),
        defaultValue: { type: 'spell', track: DEFAULT_TRACK, spellIds: [], ...BASE_TASK },
    },
});

const RequirementEdit = unionEdit<QuestRequirement>({
    item: {
        component: () => objectEdit<ItemRequirement, 'type'>({
            ...TASK_PROPERTY_CONFIG,
            itemId: { component: ItemIdEdit },
        }),
        defaultValue: { type: 'item', track: DEFAULT_TRACK, itemId: 0 as ItemId, ...BASE_TASK },
    },
});

export const TasksEdit = objectEdit<Tasks>({
    progress: { component: MultilineTextEdit },
    list: { component: arrayEdit<Task>(DEFAULT_TASK, TaskEdit) },
    requirements: { component: arrayEdit<QuestRequirement>(DEFAULT_REQUIREMENT, RequirementEdit) },
});
