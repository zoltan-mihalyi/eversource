import { InteractionTable } from '../domain/InteractionTable';
import { EntityId } from '../domain/EntityData';

export interface CharacterState {
    level: number;
    xp: number;
    id: EntityId;
}

export interface PlayerState {
    character: CharacterState | null;
    interaction: InteractionTable | null;
}