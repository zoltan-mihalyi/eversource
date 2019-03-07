import { CommonComponents } from './CommonComponents';

export type PossibleInteraction = 'trade' | 'quest' | 'quest-complete' | 'quest-complete-later' | 'pickup' | 'use';

export type PossibleInteractions = PossibleInteraction[];

export interface NetworkComponents extends CommonComponents {
    possibleInteractions: PossibleInteractions;
    playerControllable: true;
}
