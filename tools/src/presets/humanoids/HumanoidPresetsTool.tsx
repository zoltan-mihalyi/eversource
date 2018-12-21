import { PresetsTool } from '../PresetsTool';
import { HumanoidPreset } from '../../../../server/src/world/Presets';
import * as React from 'react';
import { HumanoidDisplay } from '../../../../client/src/display/HumanoidDisplay';
import { HumanoidEntityData } from '../../../../common/domain/HumanoidEntityData';
import { EntityId } from '../../../../common/domain/EntityData';
import { GameContext } from '../../../../client/src/game/GameContext';
import { BaseCreatureEntityData } from '../../../../common/domain/CreatureEntityData';
import { HumanoidEdit } from './HumanoidEdit';

const DEFAULT: HumanoidPreset = {
    name: 'Fill Me',
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
                 createDisplay={createDisplay} canCast={true}/>
);

function createDisplay(baseEntityData: BaseCreatureEntityData, preset: HumanoidPreset, context: GameContext): HumanoidDisplay {
    const entityData: HumanoidEntityData = {
        ...baseEntityData,
        type: 'humanoid',
        appearance: preset.appearance,
        equipment: preset.equipment,
    };

    return new HumanoidDisplay(0 as EntityId, context, entityData, false);
}