import { ItemQuestReward, QuestReward, RewardOptions } from '../../../server/src/quest/Quest';
import { ItemId } from '../../../common/protocol/ItemInfo';
import { unionEdit } from '../components/edit/UnionEdit';
import { objectEdit } from '../components/edit/ObjectEdit';
import { ItemIdEdit } from '../presets/common/IdEdits';
import { NumberEdit } from '../components/edit/NumberEdit';
import { arrayEdit } from '../components/edit/ArrayEdit';

const DEFAULT_QUEST_REWARD: QuestReward = {
    type: 'item',
    count: 1,
    itemId: 1 as ItemId
};

export const DEFAULT_REWARD_OPTIONS: RewardOptions = {
    options: [DEFAULT_QUEST_REWARD]
};

const QuestRewardEdit = unionEdit<QuestReward>({
    item: {
        component: () => objectEdit<ItemQuestReward, 'type'>({
            itemId: { component: ItemIdEdit },
            count: { component: NumberEdit },
        }),
        defaultValue: DEFAULT_QUEST_REWARD,
    }
});

const RewardOptionsEdit = objectEdit<RewardOptions, never>({
    options: { component: arrayEdit<QuestReward>(DEFAULT_QUEST_REWARD, QuestRewardEdit) },
});

export const RewardsEdit = arrayEdit<RewardOptions>(DEFAULT_REWARD_OPTIONS, RewardOptionsEdit);
