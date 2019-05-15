import * as React from 'react';
import { QuestStatusAction } from '../../../../common/protocol/Messages';
import { StyleRules, WithStyles } from '../interfaces';
import { brown } from '../theme';
import { injectSheet, questLevel } from '../utils';
import { Level, LevelColoredText } from '../character/LevelColoredText';
import Tooltip from 'react-tooltip-lite';
import TooltipBox from '../common/TooltipBox';
import { ResolvedText } from '../quest/ResolvedText';
import { QuestInfo } from '../../../../common/domain/InteractionTable';

type ClassKeys = 'message';

const styles: StyleRules<ClassKeys> = {
    message: {
        color: brown.lighter,
    },
};

interface Props {
    playerLevel: number;
    action: QuestStatusAction;
}

const renderQuestTooltip = (questInfo: QuestInfo, level: Level) => (
    <TooltipBox>
        <h3>
            <LevelColoredText level={level}>{questInfo.name}</LevelColoredText>
        </h3>
        <ResolvedText text={questInfo.description}/>
    </TooltipBox>
);

const RawQuestStatusActionRow: React.FunctionComponent<Props & WithStyles<ClassKeys>> = ({ playerLevel, action, classes }) => {
    const level = questLevel(playerLevel, action.quest.level);

    return (
        <span className={classes.message}>
            <LevelColoredText level={level}>
                <Tooltip arrow={false} tagName="span" content={renderQuestTooltip(action.quest, level)}>
                    [{action.quest.name}]
                </Tooltip>
            </LevelColoredText>
            {' '}
            {action.actionType/*TODO using type as translation*/}
            .
        </span>
    );
};

export const QuestStatusActionRow = injectSheet(styles)(RawQuestStatusActionRow);
