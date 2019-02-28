import { CommonComponents } from './CommonComponents';
import { NonEmptyArray } from '../util/Types';

export type PossibleInteraction = 'trade' | 'quest' | 'quest-complete' | 'quest-complete-later' | 'pickup' | 'use';

export type PossibleInteractions = NonEmptyArray<PossibleInteraction>;

export interface NetworkComponents extends CommonComponents {
    possibleInteractions: PossibleInteractions;
    playerControllable: true;
}
