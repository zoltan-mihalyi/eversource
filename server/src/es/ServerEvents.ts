import { Quests, ServerComponents } from './ServerComponents';
import { Entity } from '../../../common/es/Entity';
import { QuestId, QuestInfo } from '../../../common/domain/InteractionTable';
import { Spell } from '../Spell';

export interface Hit {
    source: Entity<ServerComponents>;
    target: Entity<ServerComponents>;
}

export interface Damage {
    type: 'physical' | 'heal';
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

interface SpellCast {
    caster: Entity<ServerComponents>;
    target: Entity<ServerComponents>;
    spell: Spell;
}

interface ChatMessageEvent {
    sender: Entity<ServerComponents>;
    text: string;
}

export interface ServerEvents {
    init: void;
    update: Update;
    networkUpdate: void;
    hit: Hit;
    kill: Kill;
    spellCast: SpellCast;
    area: Area;
    damage: Damage;
    tryInteract: TryInteract;
    tryAcceptQuest: TryAcceptQuest;
    tryCompleteQuest: TryCompleteQuest;
    tryAbandonQuest: TryCompleteQuest;
    acceptQuest: AcceptQuest;
    completeQuest: CompleteQuest;
    chatMessage: ChatMessageEvent;
}
