import * as React from 'react';
import { createView, EditPresetProps, ShowPreset } from './ShowPreset';
import { CreaturePreset } from '../../../server/src/world/Presets';
import { ListEdit } from '../components/ListEdit';
import { EditProps } from '../components/edit/Edit';

interface Props<T> {
    file: string;
    canCast: boolean;
    defaultPreset: T;
    Edit: React.ComponentType<EditPresetProps<T>>;
    createView: createView<T>;
    onExit: () => void;
}

export class PresetsTool<T extends CreaturePreset> extends React.Component<Props<T>> {
    render() {
        const fileName = `../server/data/presets/${this.props.file}.json`;

        return (
            <ListEdit fileName={fileName} defaultItem={this.props.defaultPreset} onExit={this.props.onExit}
                      EditComponent={this.EditComponent}/>
        );
    }

    private EditComponent = ({ value, onChange }: EditProps<T>) => {
        const { canCast, Edit } = this.props;

        return (
            <ShowPreset item={value} onChange={onChange} canCast={canCast} Edit={Edit}
                        createView={this.props.createView}/>
        );
    }
}
