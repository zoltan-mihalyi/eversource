import { QuestStatus } from '../../server/src/character/CharacterDetails';
import { QuestInfo } from '../domain/InteractionTable';

export interface QuestLogItem {
    status: QuestStatus;
    info: QuestInfo;
}
