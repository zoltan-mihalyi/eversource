import { Diff } from '../../../common/protocol/Diff';
import { EntityId } from '../../../common/es/Entity';
import { NetworkComponents } from '../../../common/components/NetworkComponents';
import { Nullable } from '../../../common/util/Types';
import { ChatMessage, EffectAnimationAction, PositionEffectAnimationAction, SoundEffectAction } from '../../../common/protocol/Messages';
import { Position } from '../../../common/domain/Location';

export interface CreateDisplayEvent {
    position: Position;
    display: PIXI.DisplayObject;
}

export interface ClientEvents {
    worldUpdate: Diff<EntityId, Nullable<NetworkComponents>>[];
    interact: EntityId;
    render: void;
    createDisplay: CreateDisplayEvent;
    removeDisplay: PIXI.DisplayObject;
    chatMessage: ChatMessage;
    effectAnimationAction: EffectAnimationAction;
    positionEffectAnimationAction: PositionEffectAnimationAction;
    soundEffectAction: SoundEffectAction;
}
