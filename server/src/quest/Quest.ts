import { QuestBase, QuestId, TaskTrack } from '../../../common/domain/InteractionTable';
import { ItemId } from '../../../common/protocol/Inventory';
import { InventoryItem } from '../Item';

export interface BaseTask {
    type: string;
    count: number;
    track?: TaskTrack;
}

export interface ItemRequirement extends BaseTask {
    type: 'item';
    itemId: ItemId;
}

export type QuestRequirement = ItemRequirement;

export interface VisitAreaTask extends BaseTask {
    type: 'visit';
    areaName: string;
}

export interface KillTask extends BaseTask {
    type: 'kill';
    npcIds: string[];
}

export interface SpellTask extends BaseTask {
    type: 'spell';
    spellIds: string[];
    npcIds?: string[];
}

export type Task = VisitAreaTask | KillTask | SpellTask;

export interface Tasks {
    progress: string;
    list: Task[];
    requirements: QuestRequirement[];
}

export type QuestDifficulty = 'easy' | 'normal' | 'hard';

export interface PresetQuest extends QuestBase {
    difficulty: QuestDifficulty;
    startsAt: string;
    endsAt: string;
    requires: QuestId[];
    tasks?: Tasks;
    provides?: InventoryItem[];
}

export interface Quest extends PresetQuest {
    id: QuestId;
}
