import { StyleRules, WithStyles } from '../interfaces';
import * as React from 'react';
import { injectSheet } from '../utils';
import { QuestInfo } from '../../../../common/domain/InteractionTable';
import { Rewards } from './Rewards';
import { QuestStatus } from '../../../../server/src/character/CharacterDetails';
import { TaskInfoItem } from './TaskInfoItem';
import { Enumeration } from '../common/Enumeration';
import { QuestStyle } from './QuestStyle';
import { red } from '../theme';


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
        <p>{info.description}</p>
        <h3>Completion</h3>
        <p>{info.taskDescription}</p>
        {info.tasks.length === 0 ? null : (
            status === 'failed' ? (
                <p className={classes.failed}>Quest failed</p>
            ) : (
                <Enumeration>
                    {info.tasks.map((task, i) => (
                        <li key={i}>
                            <TaskInfoItem task={task} status={status ? status[i] : null}/>
                        </li>
                    ))}
                </Enumeration>
            )
        )}
        <Rewards/>
    </QuestStyle>
);


export const QuestContent = injectSheet(styles)(RawQuestContent);
