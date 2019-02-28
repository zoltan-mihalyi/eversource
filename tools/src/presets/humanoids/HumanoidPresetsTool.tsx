import { PresetsTool } from '../PresetsTool';
import { HumanoidPreset } from '../../../../server/src/world/Presets';
import * as React from 'react';
import { HumanoidEdit } from './HumanoidEdit';
import { BASE_PRESET } from '../utils';
import { HumanoidView } from '../../../../common/components/View';

const DEFAULT: HumanoidPreset = {
    ...BASE_PRESET,
    appearance: {
        sex: 'female',
        body: ['normal', 'tanned'],
        nose: [],
        facial: [],
        hair: [],
        eyes: [],
        ears: [],
    },
    equipment: {
        shirt: [],
        legs: [],
        head: [],
        cape: [],
        belt: [],
        arms: [],
        hands: [],
        feet: [],
        chest: [],
        mask: [],
    },
};

interface Props {
    onExit: () => void;
}

export const HumanoidPresetsTool: React.SFC<Props> = ({ onExit }) => (
    <PresetsTool file={'humanoids'} defaultPreset={DEFAULT} onExit={onExit} Edit={HumanoidEdit}
                 createView={createView} canCast={true}/>
);

function createView(preset: HumanoidPreset): HumanoidView {
    return {
        type: 'humanoid',
        appearance: preset.appearance,
        equipment: preset.equipment,
    };
}