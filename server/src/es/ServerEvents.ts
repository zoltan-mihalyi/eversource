import { Quests, ServerComponents } from './ServerComponents';
import { Entity } from '../../../common/es/Entity';
import { QuestId, QuestInfo } from '../../../common/domain/InteractionTable';

export interface Hit {
    source: Entity<ServerComponents>;
    target: Entity<ServerComponents>;
}

export interface Damage {
    type: 'physical';
    amount: number;
    source: Entity<ServerComponents>;
    target: Entity<ServerComponents>;
}

export interface Kill {
    killer: Entity<ServerComponents>;
    killed: Entity<ServerComponents>;
}

export interface Area {
    visitor: Entity<ServerComponents>;
    name: string;
}

export interface Update {
    now: number;
    delta: number;
    deltaInSec: number;
}

interface TryCompleteQuest {
    entity: Entity<ServerComponents>;
    questId: QuestId;
}

interface TryInteract {
    source: Entity<ServerComponents>;
    target: Entity<ServerComponents>;
}

interface TryAcceptQuest {
    entity: Entity<ServerComponents>;
    questId: QuestId;
}

interface AcceptQuest {
    quests: Quests;
    quest: QuestInfo;
}

interface CompleteQuest {
    entity: Entity<ServerComponents>;
    quests: Quests;
    quest: QuestInfo;
}

export interface ServerEvents {
    init: void;
    update: Update;
    networkUpdate: void;
    hit: Hit;
    kill: Kill;
    area: Area;
    damage: Damage;
    tryInteract: TryInteract;
    tryAcceptQuest: TryAcceptQuest;
    tryCompleteQuest: TryCompleteQuest;
    acceptQuest: AcceptQuest;
    completeQuest: CompleteQuest;
}
