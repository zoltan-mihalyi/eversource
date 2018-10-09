import { CharacterInfo } from '../../../common/domain/CharacterInfo';
import { QuestId } from '../../../common/domain/InteractionTable';

type QuestProgression = number[];

export type QuestStatus = 'done' | 'failed' | QuestProgression;

export interface CharacterDetails {
    info: CharacterInfo;
    quests: Map<QuestId, QuestStatus>;
}
