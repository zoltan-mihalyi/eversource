import { Appearance, Equipment } from '../../../common/GameObject';

export interface Preset {
    appearance: Appearance;
    equipment: Equipment;
}

export interface Presets {
    [id: string]: Preset;
}
