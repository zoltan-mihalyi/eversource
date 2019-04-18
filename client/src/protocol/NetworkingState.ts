import { Action, ChatMessage, PlayerStateDiff, ResponseCommand, ResponseTypes } from '../../../common/protocol/Messages';
import { State } from '../../../common/util/StateManager';
import { ErrorCode } from '../../../common/protocol/ErrorCode';
import { CharacterInfo, EquipmentSlotId } from '../../../common/domain/CharacterInfo';
import { Display } from './Display';
import { Diff } from '../../../common/protocol/Diff';
import { QuestId } from '../../../common/domain/InteractionTable';
import { QuestLogItem } from '../../../common/protocol/QuestLogItem';
import { EntityId } from '../../../common/es/Entity';
import { NetworkComponents } from '../../../common/components/NetworkComponents';
import { Nullable } from '../../../common/util/Types';
import { ItemInfoWithCount, SlotId } from '../../../common/protocol/ItemInfo';
import { ItemInfo } from '../../../common/protocol/ItemInfo';

export type ResponseHandler = {
    [P in ResponseCommand]: (data: ResponseTypes[P]) => void;
}

export interface NetworkingContext {
    ws: WebSocket
    display: Display;
    closeConnection: () => void;
}

const errorMessages: { [P in ErrorCode]: string } = {
    [ErrorCode.VERSION_MISMATCH]: 'Version mismatch',
    [ErrorCode.INVALID_REQUEST]: 'Invalid request',
    [ErrorCode.INVALID_CREDENTIALS]: 'Invalid credentials',
};

const CONNECTION_CLOSED = 'Connection closed';

export abstract class NetworkingState<T> extends State<NetworkingContext, T> implements ResponseHandler {
    onOpen() {
    }

    onError(message: string) {
        this.context.display.showError(message);
        this.abort();
        this.context.closeConnection();
    }

    onClose() {
        this.onError(CONNECTION_CLOSED);
    }

    error(code: ErrorCode) {
        this.onError(errorMessages[code]);
    }

    ready() {
    }

    leaved() {
    }

    characters(characters: CharacterInfo[]) {
    }

    world(diffs: Diff<EntityId, Nullable<NetworkComponents>>[]) {
    }

    chatMessage(message: ChatMessage) {
    }

    action(action: Action) {
    }

    playerState(playerState: PlayerStateDiff) {
    }

    questLog(diffs: Diff<QuestId, QuestLogItem>[]) {
    }

    inventory(diffs: Diff<SlotId, ItemInfoWithCount>[]) {
    }

    equipment(diffs: Diff<EquipmentSlotId, ItemInfoWithCount>[]) {
    }

    protected abort() {
    }
}
