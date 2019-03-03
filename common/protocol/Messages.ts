import { CharacterInfo } from '../domain/CharacterInfo';
import { ErrorCode } from './ErrorCode';
import { Diff } from './Diff';
import { PlayerState } from './PlayerState';
import { QuestId } from '../domain/InteractionTable';
import { QuestLogItem } from './QuestLogItem';
import { EntityId } from '../es/Entity';
import { NetworkComponents } from '../components/NetworkComponents';
import { Nullable } from '../util/Types';

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

export interface ResponseTypes {
    error: ErrorCode;
    leaved: LeaveReason;
    characters: CharacterInfo[];
    ready: void;
    world: Diff<EntityId, Nullable<NetworkComponents>>[];
    playerState: PlayerStateDiff;
    chatMessage: ChatMessage;
    questLog: Diff<QuestId, QuestLogItem>[];
}

export type ResponseCommand = keyof ResponseTypes;

export const PROTOCOL_VERSION = 12;
