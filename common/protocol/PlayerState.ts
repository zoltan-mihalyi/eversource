import { InteractionTable } from '../domain/InteractionTable';

export interface CharacterState {
    level: number;
    xp: number;
}

export interface PlayerState {
    character: CharacterState | null;
    interaction: InteractionTable | null;
}
