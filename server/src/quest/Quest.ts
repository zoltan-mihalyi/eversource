import { QuestBase, QuestId } from '../../../common/domain/InteractionTable';
import { ItemId } from '../../../common/protocol/Inventory';

export interface BaseTask {
    type: string;
    count: number;
    title: string;
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
}

export interface Quest extends PresetQuest {
    id: QuestId;
}
