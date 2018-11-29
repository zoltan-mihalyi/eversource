import { CharacterInfo } from '../../../common/domain/CharacterInfo';
import { QuestId } from '../../../common/domain/InteractionTable';

export type QuestProgression = ReadonlyArray<number>;

export type QuestStatus = 'failed' | QuestProgression;

export interface CharacterDetails {
    info: CharacterInfo;
    questsDone: Set<QuestId>;
    questLog: Map<QuestId, QuestStatus>;
}
