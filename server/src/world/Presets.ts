import { Appearance, Equipment } from '../../../common/domain/HumanoidEntityData';
import { MovementConfig } from '../entity/controller/WalkingController';

interface BasePreset {
    name: string;
}

export interface HumanoidPreset extends BasePreset {
    appearance: Appearance;
    equipment: Equipment;
}

export interface HumanoidPresets {
    [id: string]: HumanoidPreset;
}

export interface MonsterPreset extends BasePreset {
    image: string;
    palette: string | null;
    movement?: MovementConfig;
}

export interface MonsterPresets {
    [id: string]: MonsterPreset;
}
