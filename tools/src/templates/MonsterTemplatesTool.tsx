import * as React from 'react';
import { ListEdit } from '../components/ListEdit';
import { EMPTY_SOUND_DESCRIPTOR, MonsterTemplate, MonsterTemplateEditWithName } from './MonsterTemplateEdit';

const FILE_NAME = '../server/data/templates/monster-templates.json';

interface Props {
    onExit: () => void;
}

const DEFAULT_TEMPLATE: MonsterTemplate = {
    name: 'Unnamed Template',
    sound: EMPTY_SOUND_DESCRIPTOR,
};

export class MonsterTemplatesTool extends React.PureComponent<Props> {
    render() {
        return (
            <ListEdit fileName={FILE_NAME} defaultItem={DEFAULT_TEMPLATE} onExit={this.props.onExit} EditComponent={MonsterTemplateEditWithName}/>
        );
    }
}
