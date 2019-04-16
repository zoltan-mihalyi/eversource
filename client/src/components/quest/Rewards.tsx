import * as React from 'react';
import { Enumeration } from '../common/Enumeration';
import { QuestInfo } from '../../../../common/domain/InteractionTable';
import { QuestRewardOptions } from './QuestRewardOptions';

interface Props {
    info: QuestInfo;
    selectedRewards?: number[];
    selectReward?: (selected: number[]) => void;
}

export const Rewards: React.FunctionComponent<Props> = ({ info, selectedRewards, selectReward }) => (
    <>
        <h3>Rewards</h3>
        {info.rewards.map((rewardOptionsInfo, i) => (
            <QuestRewardOptions key={i} rewardOptionsInfo={rewardOptionsInfo} selected={selectedRewards && selectedRewards[i]}
                                selectReward={itemIndex => selectReward!(setItem(selectedRewards!, i, itemIndex))}/>
        ))}
        <Enumeration>
            <li>Experience: {info.xpReward}</li>
            <li>Gold: 50</li>
        </Enumeration>
    </>
);

function setItem<T>(array: T[], index: number, item: T): T[] {
    return array.map((value, i) => i === index ? item : value);
}