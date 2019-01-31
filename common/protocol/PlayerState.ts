import { InteractionTable } from '../domain/InteractionTable';
import { EntityId } from '../es/Entity';

export interface CharacterState {
    level: number;
    xp: number;
    id: EntityId;
}

export interface PlayerState {
    character: CharacterState | null;
    interaction: InteractionTable | null;
}
