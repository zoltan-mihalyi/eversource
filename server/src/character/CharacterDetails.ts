import { CharacterInfo } from '../../../common/domain/CharacterInfo';
import { QuestId } from '../../../common/domain/InteractionTable';
import { InventoryItem } from '../Item';

export type QuestProgression = ReadonlyArray<number>;

export type QuestStatus = 'failed' | QuestProgression;

export interface CharacterDetails {
    info: CharacterInfo;
    items: InventoryItem[];
    questsDone: Set<QuestId>;
    questLog: Map<QuestId, QuestStatus>;
}
