import { StyleRules, WithStyles } from '../interfaces';
import * as React from 'react';
import { injectSheet } from '../utils';
import { QuestInfo } from '../../../../common/domain/InteractionTable';
import { Rewards } from './Rewards';
import { QuestStatus } from '../../../../server/src/quest/QuestLog';
import { TaskInfoItem } from './TaskInfoItem';
import { Enumeration } from '../common/Enumeration';
import { QuestStyle } from './QuestStyle';
import { red } from '../theme';
import { ResolvedText } from './ResolvedText';


type ClassKeys = 'failed';

const styles: StyleRules<ClassKeys> = {
    failed: {
        color: red.normal,
    },
};

interface Props {
    info: QuestInfo;
    status?: QuestStatus;
}

const RawQuestContent: React.FunctionComponent<Props & WithStyles<ClassKeys>> = ({ info, classes, status }) => (
    <QuestStyle>
        <h2>{info.name}</h2>
        <ResolvedText text={info.description}/>
        <h3>Completion</h3>
        <ResolvedText text={info.taskDescription}/>
        {info.tasks.length === 0 ? null : (
            status === 'failed' ? (
                <p className={classes.failed}>Quest failed</p>
            ) : (
                <Enumeration>
                    {info.tasks.map((task, i) => (
                        <TaskInfoItem key={i} task={task} status={status ? status[i] : null}/>
                    ))}
                </Enumeration>
            )
        )}
        <Rewards info={info}/>
    </QuestStyle>
);


export const QuestContent = injectSheet(styles)(RawQuestContent);
