import { PresetsTool } from '../PresetsTool';
import { ObjectPreset } from '../../../../server/src/world/Presets';
import * as React from 'react';
import { ObjectEdit } from './ObjectEdit';
import { ObjectView } from '../../../../common/components/View';
import { EditPresetProps } from '../ShowPreset';

const DEFAULT: ObjectPreset = {
    name: 'Carrot',
    image: 'plants',
    animation: 'carrot',
};

interface Props {
    onExit: () => void;
}

const EmptyEdit: React.SFC<EditPresetProps<ObjectPreset>> = () => null;

export const ObjectPresetTool: React.SFC<Props> = ({ onExit }) => (
    <PresetsTool<ObjectPreset> file={'objects'} defaultPreset={DEFAULT} onExit={onExit} createView={createView}
                               BaseEdit={EmptyEdit} Edit={ObjectEdit} canCast={false}/>
);

function createView(preset: ObjectPreset): ObjectView {
    return {
        type: 'object',
        image: preset.image,
        animation: preset.animation,
    };
}
