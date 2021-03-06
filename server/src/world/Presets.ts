import { Appearance, EquipmentView } from '../../../common/components/View';
import { CreatureAttitude, Effect } from '../../../common/components/CommonComponents';
import { ItemId } from '../../../common/protocol/ItemInfo';

export interface BasePreset {
    name: string;
    story?: string;
    scale?: number;
    effects?: Effect[];
}

export interface CreaturePreset extends BasePreset {
    level: number;
    attitude?: PresetAttitude;
}

export type PresetAttitude = "friendly" | "neutral" | "hostile";

export interface HumanoidPreset extends CreaturePreset {
    appearance: Appearance;
    equipment: EquipmentView;
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

export interface MonsterPreset extends CreaturePreset {
    image: string;
    palette: string | null;
    movement?: MovementConfig;
}

export interface MonsterPresets {
    [id: string]: MonsterPreset;
}

export interface LootElement {
    minCount: number;
    maxCount: number;
    chance: number;
    itemId: ItemId;
}

export interface ObjectPreset extends BasePreset {
    image: string;
    animation: string;
    useSpell?: string;
    loot?: LootElement[];
}

export interface ObjectPresets {
    [id: string]: ObjectPreset;
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
