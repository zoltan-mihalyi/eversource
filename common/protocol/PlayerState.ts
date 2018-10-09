import { InteractionTable } from '../domain/InteractionTable';

export interface PlayerState {
    interaction: InteractionTable | null;
}