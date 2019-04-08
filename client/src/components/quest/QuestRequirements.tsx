import * as React from 'react';
import { InventoryItemIcon } from '../inventory/InventoryItemIcon';
import { RequirementInfo } from '../../../../common/domain/InteractionTable';

interface Props {
    requirements: RequirementInfo[];
}

export const QuestRequirements: React.FunctionComponent<Props> = ({ requirements }) => {
    if (requirements.length === 0) {
        return null;
    }

    return (
        <>
            <h3>Requirements</h3>
            {requirements.map((requirement, i) => (
                <InventoryItemIcon key={i} itemInfo={requirement}/>
            ))}
        </>
    );
};