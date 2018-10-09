import { CharacterInfo } from '../domain/CharacterInfo';
import { ErrorCode } from './ErrorCode';
import { Diff } from './Diff';
import { PlayerState } from './PlayerState';

export interface RequestTypes {
    enter: string;
    ready: void;
    leave: void;
    command: string;
}

export type RequestCommand = keyof RequestTypes;

export type LeaveReason = 'leave' | 'timeout'

export interface ResponseTypes {
    error: ErrorCode;
    leaved: LeaveReason;
    characters: CharacterInfo[];
    ready: void;
    diffs: Diff[];
    playerState: Partial<PlayerState>;
}

export type ResponseCommand = keyof ResponseTypes;

export const PROTOCOL_VERSION = 11;
