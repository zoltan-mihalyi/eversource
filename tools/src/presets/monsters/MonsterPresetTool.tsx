import { PresetsTool } from '../PresetsTool';
import { MonsterPreset } from '../../../../server/src/world/Presets';
import * as React from 'react';
import { BaseCreatureEntityData } from '../../../../common/domain/CreatureEntityData';
import { GameContext } from '../../../../client/src/game/GameContext';
import { MonsterEdit } from './MonsterEdit';
import { MonsterDisplay } from '../../../../client/src/display/MonsterDisplay';
import { MonsterEntityData } from '../../../../common/domain/MonsterEntityData';
import { BASE_PRESET } from '../utils';
import { EntityId } from '../../../../common/es/Entity';

const DEFAULT: MonsterPreset = {
    ...BASE_PRESET,
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