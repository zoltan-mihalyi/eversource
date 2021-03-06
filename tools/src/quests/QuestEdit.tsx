import * as React from 'react';
import { objectEdit } from '../components/edit/ObjectEdit';
import { MultilineTextEdit, TextEdit } from '../components/edit/TextEdit';
import { PresetQuest, RewardOptions, Tasks } from '../../../server/src/quest/Quest';
import { NumberEdit } from '../components/edit/NumberEdit';
import { optionEdit } from '../components/edit/OptionEdit';
import { arrayEdit } from '../components/edit/ArrayEdit';
import { QuestId } from '../../../common/domain/InteractionTable';
import { optionalEdit } from '../components/edit/OptionalEdit';
import { TasksEdit } from './TaskEdit';
import { InventoryItem } from '../../../server/src/Item';
import { ItemId } from '../../../common/protocol/ItemInfo';
import { ItemIdEdit, QuestIdEdit } from '../presets/common/IdEdits';
import { DEFAULT_REWARD_OPTIONS, RewardsEdit } from './RewardsEdit';

const DEFAULT_TASKS: Tasks = {
    progress: 'Are you done?',
    list: [],
    requirements: [],
};

const DEFAULT_ITEM: InventoryItem = {
    itemId: 1 as ItemId,
    count: 1,
};

const DEFAULT_REWARDS: RewardOptions[] = [DEFAULT_REWARD_OPTIONS];

const InventoryItemEdit = objectEdit<InventoryItem>({
    count: { component: NumberEdit },
    itemId: { component: ItemIdEdit },
});

export const QuestEdit = objectEdit<PresetQuest>({
    name: { component: TextEdit },
    level: { component: NumberEdit },
    description: { component: MultilineTextEdit },
    taskDescription: { component: MultilineTextEdit },
    completion: { component: MultilineTextEdit },
    difficulty: { component: optionEdit(['easy', 'normal', 'hard']) },
    startsAt: { component: TextEdit },
    endsAt: { component: TextEdit },
    requires: { component: arrayEdit<QuestId>(0 as QuestId, QuestIdEdit) },
    provides: { component: optionalEdit<InventoryItem[], undefined>([], arrayEdit(DEFAULT_ITEM, InventoryItemEdit), void 0) },
    tasks: { component: optionalEdit<Tasks, undefined>(DEFAULT_TASKS, TasksEdit, void 0) },
    rewards: { component: optionalEdit<RewardOptions[], undefined>(DEFAULT_REWARDS, RewardsEdit, void 0) }
});
