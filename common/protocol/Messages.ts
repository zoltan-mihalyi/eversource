import { CharacterInfo } from '../domain/CharacterInfo';
import { ErrorCode } from './ErrorCode';
import { Diff } from './Diff';
import { PlayerState } from './PlayerState';
import { EntityData } from '../domain/EntityData';
import { QuestId } from '../domain/InteractionTable';
import { QuestLogItem } from './QuestLogItem';
import { EntityId } from '../es/Entity';

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

export interface ResponseTypes {
    error: ErrorCode;
    leaved: LeaveReason;
    characters: CharacterInfo[];
    ready: void;
    world: Diff<EntityId, EntityData>[];
    playerState: PlayerStateDiff;
    questLog: Diff<QuestId, QuestLogItem>[];
}

export type ResponseCommand = keyof ResponseTypes;

export const PROTOCOL_VERSION = 12;
