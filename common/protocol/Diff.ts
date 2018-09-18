import { GameObject, ObjectId } from '../GameObject';

interface BaseDiff {
    type: string;
    id: ObjectId;
}

interface Remove extends BaseDiff {
    type: 'remove';
}

interface Change extends BaseDiff {
    type: 'change';
    changes: Partial<GameObject>;
}

interface Create extends BaseDiff {
    type: 'create';
    self: boolean;
    object: GameObject;
}

export type Diff = Remove | Change | Create;
