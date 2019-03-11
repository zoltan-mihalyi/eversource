import * as React from 'react';
import { ListEdit } from '../components/ListEdit';
import { PresetItem } from '../../../server/src/Item';
import { ItemEdit } from './ItemEdit';

const FILE_NAME = '../server/data/items.json';

const DEFAULT_QUEST: PresetItem = {
    name: 'Magic Cloth',
    image: 'plants',
    animation: 'carrot',
    quality: 'common'
};

interface Props {
    onExit: () => void;
}

export class ItemsTool extends React.PureComponent<Props> {
    render() {
        return (
            <ListEdit fileName={FILE_NAME} defaultItem={DEFAULT_QUEST} onExit={this.props.onExit} EditComponent={ItemEdit}/>
        );
    }
}
