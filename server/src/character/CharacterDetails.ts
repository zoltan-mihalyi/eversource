import { CharacterInfo } from '../../../common/domain/CharacterInfo';
import { QuestId } from '../../../common/domain/InteractionTable';

type QuestProgression = number[];

export type QuestStatus = 'failed' | QuestProgression;

export interface CharacterDetails {
    info: CharacterInfo;
    questsDone: Set<QuestId>;
    questLog: Map<QuestId, QuestStatus>;
}
