import { Diff } from '../../../common/protocol/Diff';
import { EntityId } from '../../../common/es/Entity';
import { NetworkComponents } from '../../../common/components/NetworkComponents';
import { Nullable } from '../../../common/util/Types';

export interface ClientEvents {
    worldUpdate: Diff<EntityId, Nullable<NetworkComponents>>[];

    interact: EntityId;

    render: void;
}