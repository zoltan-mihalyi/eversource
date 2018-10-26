import { InteractionTable } from '../domain/InteractionTable';
import { EntityId } from '../domain/EntityData';

interface CharacterState {
    id: EntityId;
}

export interface PlayerState {
    character: CharacterState | null;
    interaction: InteractionTable | null;
}