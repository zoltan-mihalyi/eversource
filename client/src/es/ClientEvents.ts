import { Diff } from '../../../common/protocol/Diff';
import { EntityId } from '../../../common/es/Entity';
import { NetworkComponents } from '../../../common/components/NetworkComponents';
import { Nullable } from '../../../common/util/Types';
import { ChatMessage, EffectAnimationAction, SoundEffectAction } from '../../../common/protocol/Messages';

export interface ClientEvents {
    worldUpdate: Diff<EntityId, Nullable<NetworkComponents>>[];

    interact: EntityId;

    render: void;

    chatMessage: ChatMessage;

    effectAnimationAction: EffectAnimationAction;

    soundEffectAction: SoundEffectAction;
}
