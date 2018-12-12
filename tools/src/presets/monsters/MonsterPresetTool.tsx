import { PresetsTool } from '../PresetsTool';
import { HumanoidPreset, MonsterPreset } from '../../../../server/src/world/Presets';
import * as React from 'react';
import { BaseCreatureEntityData } from '../../../../common/domain/CreatureEntityData';
import { GameContext } from '../../../../client/src/game/GameContext';
import { HumanoidDisplay } from '../../../../client/src/display/HumanoidDisplay';
import { HumanoidEntityData } from '../../../../common/domain/HumanoidEntityData';
import { EntityId } from '../../../../common/domain/EntityData';
import { MonsterEdit } from './MonsterEdit';
import { MonsterDisplay } from '../../../../client/src/display/MonsterDisplay';
import { MonsterEntityData } from '../../../../common/domain/MonsterEntityData';

const DEFAULT: MonsterPreset = {
    name: 'Fill Me',
    image: 'bee',
    palette: null,
};

interface Props {
    onExit: () => void;
}

export const MonsterPresetTool: React.SFC<Props> = ({ onExit }) => (
    <PresetsTool file={'monsters'} defaultPreset={DEFAULT} onExit={onExit} createDisplay={createDisplay}
                 Edit={MonsterEdit} canCast={false}/>
);

function createDisplay(baseEntityData: BaseCreatureEntityData, preset: MonsterPreset, context: GameContext): MonsterDisplay {
    const entityData: MonsterEntityData = {
        ...baseEntityData,
        type: 'monster',
        image: preset.image,
        palette: preset.palette,
    };

    return new MonsterDisplay(0 as EntityId, context, entityData, false);
}