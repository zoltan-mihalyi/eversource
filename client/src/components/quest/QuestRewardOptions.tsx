import { RewardOptionsInfo } from '../../../../common/domain/InteractionTable';
import { InventoryItemIcon } from '../inventory/InventoryItemIcon';
import * as React from 'react';
import { StyleRules, WithStyles } from '../interfaces';
import { className, injectSheet, SMALL_DEVICE } from '../utils';
import { Checkbox } from '../common/Input/Checkbox';

type ClassKeys = 'root' | 'noChoice' | 'item' | 'or';

const styles: StyleRules<ClassKeys> = {
    root: {
        marginTop: 6,
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',

        [SMALL_DEVICE]: {
            marginTop: 3,
        },
    },
    noChoice: {
        display: 'inline-block'
    },
    item: {
        display: 'inline-block',
        marginLeft: 6,
        marginRight: 6,
        marginTop: 4,

        '&>label': {
            display: 'flex',
            alignItems: 'center',
        },

        [SMALL_DEVICE]: {
            marginLeft: 3,
            marginRight: 3,
            marginTop: 2,
        },
    },
    or: {
        marginRight: 6,

        [SMALL_DEVICE]: {
            marginRight: 3,
        },
    }
};

interface Props {
    rewardOptionsInfo: RewardOptionsInfo;
    selected?: number;
    selectReward: (index: number) => void;
}

const RawQuestRewardOptions: React.FunctionComponent<Props & WithStyles<ClassKeys>> = ({ rewardOptionsInfo, selected, selectReward, classes }) => {
    const hasChoice = rewardOptionsInfo.options.length > 1;

    return (
        <div className={className(classes.root, !hasChoice && classes.noChoice)}>
            {rewardOptionsInfo.options.map((questRewardInfo, i) => {
                const icon = <InventoryItemIcon itemInfo={questRewardInfo}/>;

                return (
                    <div key={i} className={classes.item}>
                        {hasChoice ? (
                            selected !== void 0 ? (
                                <Checkbox checked={selected === i} onChange={() => selectReward(i)}>{icon}</Checkbox>
                            ) : (
                                <label>
                                    {i > 0 && <span className={classes.or}>Or</span>}
                                    {icon}
                                </label>
                            )
                        ) : (icon)}

                    </div>
                );
            })}
        </div>
    );
};

export const QuestRewardOptions = injectSheet(styles)(RawQuestRewardOptions);