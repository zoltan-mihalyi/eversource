import * as React from 'react';
import { ListEdit } from '../components/ListEdit';
import { QuestEdit } from './QuestEdit';
import { PresetQuest, Quest } from '../../../server/src/quest/Quest';
import { QuestId } from '../../../common/domain/InteractionTable';

const FILE_NAME = '../server/data/quests.json';

const DEFAULT_QUEST: PresetQuest = {
    name: 'A magic journey',
    level: 1,
    difficulty: 'normal',
    startsAt: 'cacal',
    endsAt: 'cacal',
    requires: [],
    completion: 'Good job!',
    description: 'Help me!',
    taskDescription: 'Complete the task',
};

interface Props {
    onExit: () => void;
}

export class QuestsTool extends React.PureComponent<Props> {
    render() {
        return (
            <ListEdit fileName={FILE_NAME} defaultItem={DEFAULT_QUEST} onExit={this.props.onExit} EditComponent={QuestEdit}/>
        );
    }
}
