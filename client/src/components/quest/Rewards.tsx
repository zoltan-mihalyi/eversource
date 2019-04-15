import * as React from 'react';
import { Enumeration } from '../common/Enumeration';
import { QuestInfo } from '../../../../common/domain/InteractionTable';

interface Props {
    info: QuestInfo;
}

export const Rewards: React.FunctionComponent<Props> = ({info}) => (
    <>
        <h3>Rewards</h3>
        <Enumeration>
            <li>Experience: {info.xpReward}</li>
            <li>Gold: 50</li>
        </Enumeration>
    </>
);