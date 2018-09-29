import { EntityData, EntityId } from '../domain/EntityData';

interface BaseDiff {
    type: string;
    id: EntityId;
}

interface Remove extends BaseDiff {
    type: 'remove';
}

interface Change extends BaseDiff {
    type: 'change';
    changes: Partial<EntityData>;
}

interface Create extends BaseDiff {
    type: 'create';
    self: boolean;
    data: EntityData;
}

export type Diff = Remove | Change | Create;
