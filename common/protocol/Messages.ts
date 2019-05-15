import { CharacterInfo, EquipmentSlotId } from '../domain/CharacterInfo';
import { ErrorCode } from './ErrorCode';
import { Diff } from './Diff';
import { PlayerState } from './PlayerState';
import { QuestId, QuestInfo } from '../domain/InteractionTable';
import { QuestLogItem } from './QuestLogItem';
import { EntityId } from '../es/Entity';
import { NetworkComponents } from '../components/NetworkComponents';
import { Nullable } from '../util/Types';
import { ItemInfo, ItemInfoWithCount, SlotId } from './ItemInfo';
import { EffectAnimation } from '../components/CommonComponents';

export interface RequestTypes {
    enter: string;
    ready: void;
    leave: void;
    command: string;
}

export type RequestCommand = keyof RequestTypes;

export type LeaveReason = 'leave' | 'timeout'

export type PlayerStateDiff = {
    [P in keyof PlayerState]?: Partial<PlayerState[P]>;
}

export interface ChatMessage {
    sender: string;
    entityId?: EntityId;
    text: string;
}

export interface EffectAnimationAction {
    type: 'effect';
    entityId: EntityId;
    effectAnimation: EffectAnimation;
}

export interface QuestStatusAction {
    type: 'quest-status';
    quest: QuestInfo;
    actionType: 'accepted' | 'abandoned' | 'completed';
}

interface EquipmentAction {
    type: 'equipment';
    item: ItemInfo;
    actionType: 'equip' | 'unequip';
}

export interface InventoryAction {
    type: 'inventory';
    items: ItemInfoWithCount[];
    actionType: 'loot' | 'destroy';
}

export interface FailedAction {
    type: 'failed';
    actionType: 'too-far-away' | 'no-reward-selected';
}

export type Action = EffectAnimationAction | QuestStatusAction | EquipmentAction | InventoryAction | FailedAction;

export interface ResponseTypes {
    error: ErrorCode;
    leaved: LeaveReason;
    characters: CharacterInfo[];
    ready: void;
    world: Diff<EntityId, Nullable<NetworkComponents>>[];
    playerState: PlayerStateDiff;
    chatMessage: ChatMessage;
    action: Action;
    questLog: Diff<QuestId, QuestLogItem>[];
    inventory: Diff<SlotId, ItemInfoWithCount>[];
    equipment: Diff<EquipmentSlotId, ItemInfoWithCount>[];
}

export type ResponseCommand = keyof ResponseTypes;

export const PROTOCOL_VERSION = 13;
