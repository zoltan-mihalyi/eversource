import { Appearance, Equipment } from '../../../common/domain/HumanoidEntityData';

export interface Preset {
    name: string;
    appearance: Appearance;
    equipment: Equipment;
}

export interface Presets {
    [id: string]: Preset;
}
