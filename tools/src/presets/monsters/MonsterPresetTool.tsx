import { PresetsTool } from '../PresetsTool';
import { MonsterPreset } from '../../../../server/src/world/Presets';
import * as React from 'react';
import { MonsterEdit } from './MonsterEdit';
import { BASE_PRESET } from '../utils';
import { SimpleView } from '../../../../common/components/View';
import { CreatureEdit } from '../CreatureEdit';

const DEFAULT: MonsterPreset = {
    ...BASE_PRESET,
    image: 'bee',
    palette: null,
};

interface Props {
    onExit: () => void;
}

export const MonsterPresetTool: React.SFC<Props> = ({ onExit }) => (
    <PresetsTool<MonsterPreset> file={'monsters'} defaultPreset={DEFAULT} onExit={onExit} createView={createView}
                 BaseEdit={CreatureEdit} Edit={MonsterEdit} canCast={false}/>
);

function createView(preset: MonsterPreset): SimpleView {
    return {
        type: 'simple',
        image: preset.image,
        palette: preset.palette,
    };
}
