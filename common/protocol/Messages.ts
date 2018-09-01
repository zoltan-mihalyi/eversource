import { CharacterInfo } from '../domain/CharacterInfo';

export interface RequestTypes {
    characters: void;
    enter: string;
    ready: void;
    leave: void;
}

export type RequestCommand = keyof RequestTypes;


export type LeaveReason = 'leave' | 'timeout'

export interface ResponseTypes {
    leaved: LeaveReason;
    characters: CharacterInfo[];
    ready: void;
}

export type ResponseCommand = keyof ResponseTypes;
