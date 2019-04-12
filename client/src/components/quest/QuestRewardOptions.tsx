import { RewardOptionsInfo } from '../../../../common/domain/InteractionTable';
import { InventoryItemIcon } from '../inventory/InventoryItemIcon';
import * as React from 'react';
import { StyleRules, WithStyles } from '../interfaces';
import { injectSheet } from '../utils';

type ClassKeys = 'root'|'or';

const styles: StyleRules<ClassKeys> = {
    root:{
        marginTop: 10,
        display:'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    or: {
        marginLeft: 6,
        marginRight: 6,
    },
};

interface Props {
    rewardOptionsInfo: RewardOptionsInfo;
}

const RawQuestRewardOptions: React.FunctionComponent<Props & WithStyles<ClassKeys>> = ({ rewardOptionsInfo, classes }) => (
    <div className={classes.root}>
        {rewardOptionsInfo.options.map((questRewardInfo, i) => (
            <>
                {i > 0 && <span className={classes.or}>Or</span>}
                <InventoryItemIcon key={i} itemInfo={questRewardInfo}/>
            </>
        ))}
    </div>
);

export const QuestRewardOptions = injectSheet(styles)(RawQuestRewardOptions);