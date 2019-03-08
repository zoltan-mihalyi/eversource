import { QuestBase, QuestId } from '../../../common/domain/InteractionTable';

interface BaseTask {
    type: string;
    count: number;
    title: string;
}

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

export interface ItemTask extends BaseTask {
    type: 'item';
}

export type Task = VisitAreaTask | KillTask | ItemTask | SpellTask;

export interface Tasks {
    progress: string;
    list: Task[];
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
