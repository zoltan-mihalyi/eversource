import { Appearance, Equipment } from '../../../common/domain/HumanoidEntityData';
import { MovementConfig } from '../entity/controller/WalkingController';
import { CreatureAttitude } from '../../../common/domain/CreatureEntityData';

interface BasePreset {
    name: string;
}

export type PresetAttitude = "friendly" | "neutral" | "hostile";

export interface HumanoidPreset extends BasePreset {
    appearance: Appearance;
    equipment: Equipment;
    attitude?: PresetAttitude;
}

export interface HumanoidPresets {
    [id: string]: HumanoidPreset;
}

export interface MonsterPreset extends BasePreset {
    image: string;
    palette: string | null;
    attitude?: PresetAttitude;
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
        return resolveGivenAttitude(monster ? 'hostile' : 'friendly');
    }
    return resolveGivenAttitude(attitude);

}