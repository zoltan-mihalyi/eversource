import { PlayerStateDiff, ResponseCommand, ResponseTypes } from '../../../common/protocol/Messages';
import { State } from '../../../common/util/StateManager';
import { ErrorCode } from '../../../common/protocol/ErrorCode';
import { CharacterInfo } from '../../../common/domain/CharacterInfo';
import { Display } from './Display';
import { Diff } from '../../../common/protocol/Diff';
import { EntityData, EntityId } from '../../../common/domain/EntityData';
import { QuestId } from '../../../common/domain/InteractionTable';
import { QuestLogItem } from '../../../common/protocol/QuestLogItem';
import { AbstractNetConnection } from '../webrtc/WebRTCServerConnection';

export type ResponseHandler = {
    [P in ResponseCommand]: (data: ResponseTypes[P]) => void;
}

export interface NetworkingContext {
    connection: AbstractNetConnection;
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

    onClose() {
        this.context.display.showConnectionError(CONNECTION_CLOSED);
        this.abort();
    }

    error(code: ErrorCode) {
        this.context.display.showConnectionError(errorMessages[code]);
        this.abort();
        this.context.closeConnection();
    }

    ready() {
    }

    leaved() {
    }

    characters(characters: CharacterInfo[]) {
    }

    world(diffs: Diff<EntityId, EntityData>[]) {
    }

    playerState(playerState: PlayerStateDiff) {
    }

    questLog(diffs: Diff<QuestId, QuestLogItem>[]) {
    }

    protected abort() {
    }
}
