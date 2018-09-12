import { CharacterInfo } from '../domain/CharacterInfo';
import { GameObject } from '../GameObject';
import { ErrorCode } from './ErrorCode';

export interface RequestTypes {
    enter: string;
    ready: void;
    leave: void;
    command: string;
}

export type RequestCommand = keyof RequestTypes;


export type LeaveReason = 'leave' | 'timeout'

export interface GameState {
    character: GameObject;
    others: GameObject[];
}

export interface ResponseTypes {
    error: ErrorCode;
    leaved: LeaveReason;
    characters: CharacterInfo[];
    ready: void;
    state: GameState;
}

export type ResponseCommand = keyof ResponseTypes;

export const PROTOCOL_VERSION = 2;
