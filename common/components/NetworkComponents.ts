import { CommonComponents } from './CommonComponents';
import { View } from './View';

export type PossibleInteraction = 'trade' | 'story' | 'quest' | 'quest-complete' | 'quest-complete-later' | 'pickup' | 'use';

export type PossibleInteractions = PossibleInteraction[];

export interface NetworkComponents extends CommonComponents {
    possibleInteractions: PossibleInteractions;
    playerControllable: true;
}
