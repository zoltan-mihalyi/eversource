import { CharacterInfo } from '../../../common/domain/CharacterInfo';
import { QuestId } from '../../../common/domain/InteractionTable';
import { InventoryItem } from '../Item';
import { QuestLog } from '../quest/QuestLog';

export interface CharacterDetails {
    info: CharacterInfo;
    items: InventoryItem[];
    questsDone: Set<QuestId>;
    questLog: QuestLog;
}
