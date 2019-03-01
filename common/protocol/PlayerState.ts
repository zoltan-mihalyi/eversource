import { InteractionTable } from '../domain/InteractionTable';
import { ClassId } from '../domain/CharacterInfo';

export interface CharacterState {
    name: string;
    sex: 'male' | 'female';
    classId: ClassId;
    level: number;
    xp: number;
}

export interface PlayerState {
    character: CharacterState | null;
    interaction: InteractionTable | null;
}
