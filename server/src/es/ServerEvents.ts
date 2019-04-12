import { Quests, ServerComponents } from './ServerComponents';
import { Entity } from '../../../common/es/Entity';
import { QuestId, QuestInfo } from '../../../common/domain/InteractionTable';
import { Spell } from '../Spell';
import { LootElement } from '../world/Presets';
import { EquipmentSlotId } from '../../../common/domain/CharacterInfo';
import { SlotId } from '../../../common/protocol/ItemInfo';

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

export interface Loot {
    entity: Entity<ServerComponents>;
    looted: Entity<ServerComponents>;
    loot: LootElement[];
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
    entity: Entity<ServerComponents>;
    quests: Quests;
    questId: QuestId;
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

interface EquipEvent {
    entity: Entity<ServerComponents>;
    slotId: SlotId;
    equipmentSlotId: EquipmentSlotId;
}

interface UnequipEvent {
    entity: Entity<ServerComponents>;
    equipmentSlotId: EquipmentSlotId;
}

export interface ServerEvents {
    init: void;
    update: Update;
    networkUpdate: void;
    hit: Hit;
    kill: Kill;
    trySpellCast: SpellCast;
    spellCast: SpellCast;
    area: Area;
    damage: Damage;
    loot: Loot;
    tryInteract: TryInteract;
    tryAcceptQuest: TryAcceptQuest;
    tryCompleteQuest: TryCompleteQuest;
    tryAbandonQuest: TryCompleteQuest;
    acceptQuest: AcceptQuest;
    completeQuest: CompleteQuest;
    chatMessage: ChatMessageEvent;
    equip: EquipEvent;
    unequip: UnequipEvent;
}
