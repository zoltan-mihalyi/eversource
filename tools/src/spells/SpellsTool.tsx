import * as React from 'react';
import { ListEdit } from '../components/ListEdit';
import { PresetSpell } from '../../../server/src/Spell';
import { SpellEdit } from './SpellEdit';

const FILE_NAME = '../server/data/spells.json';

const DEFAULT_SPELL: PresetSpell = {
    name: 'Magic strike',
    effects: [],
};

interface Props {
    onExit: () => void;
}

export class SpellsTool extends React.PureComponent<Props> {
    render() {
        return (
            <ListEdit fileName={FILE_NAME} defaultItem={DEFAULT_SPELL} onExit={this.props.onExit} EditComponent={SpellEdit}/>
        );
    }
}
