import * as React from 'react';
import { objectEdit } from '../components/edit/ObjectEdit';
import { MultilineTextEdit, TextEdit } from '../components/edit/TextEdit';
import { PresetQuest, Tasks } from '../../../server/src/quest/Quest';
import { NumberEdit } from '../components/edit/NumberEdit';
import { optionEdit } from '../components/edit/OptionEdit';
import { arrayEdit } from '../components/edit/ArrayEdit';
import { EditComponent } from '../components/edit/Edit';
import { QuestId } from '../../../common/domain/InteractionTable';
import { optionalEdit } from '../components/edit/OptionalEdit';
import { TasksEdit } from './TaskEdit';

const DEFAULT_TASKS: Tasks = {
    progress: 'Are you done?',
    list: [],
};

export const QuestEdit = objectEdit<PresetQuest>({
    name: { component: TextEdit },
    level: { component: NumberEdit },
    description: { component: MultilineTextEdit },
    taskDescription: { component: MultilineTextEdit },
    completion: { component: MultilineTextEdit },
    difficulty: { component: optionEdit(['easy', 'normal', 'hard']) },
    startsAt: { component: TextEdit },
    endsAt: { component: TextEdit },
    requires: { component: arrayEdit<QuestId>(0 as QuestId, NumberEdit as EditComponent<any>) },
    tasks: { component: optionalEdit<Tasks, undefined>(DEFAULT_TASKS, TasksEdit, void 0) }
});
