import {Appearance, Equipment} from '../../../common/components/View';
import { CreatureAttitude, Effect } from '../../../common/components/CommonComponents';

export interface BasePreset {
    name: string;
    story?: string;
    level: number;
    attitude?: PresetAttitude;
    scale?: number;
    effects?: Effect[];
}

export type PresetAttitude = "friendly" | "neutral" | "hostile";

export interface HumanoidPreset extends BasePreset {
    appearance: Appearance;
    equipment: Equipment;
}

export interface HumanoidPresets {
    [id: string]: HumanoidPreset;
}

export interface MovementConfig {
    running?: boolean;
    interval?: number;
    radiusX?: number;
    radiusY?: number;
}

export interface MonsterPreset extends BasePreset {
    image: string;
    palette: string | null;
    movement?: MovementConfig;
}

export interface MonsterPresets {
    [id: string]: MonsterPreset;
}

function resolveGivenAttitude(attitude: PresetAttitude): CreatureAttitude {
    switch (attitude) {
        case 'friendly':
            return CreatureAttitude.FRIENDLY;
        case 'neutral':
            return CreatureAttitude.NEUTRAL;
        case 'hostile':
            return CreatureAttitude.HOSTILE;
    }
}

export function resolvePresetAttitude(attitude: PresetAttitude | undefined, monster: boolean): CreatureAttitude {
    if (attitude === void 0) {
        return monster ? CreatureAttitude.HOSTILE : CreatureAttitude.FRIENDLY;
    }
    return resolveGivenAttitude(attitude);

}
