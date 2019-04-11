import { QuestStatus } from '../../server/src/quest/QuestLog';
import { QuestInfo } from '../domain/InteractionTable';

export interface QuestLogItem {
    status: QuestStatus;
    info: QuestInfo;
}
