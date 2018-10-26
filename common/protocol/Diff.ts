interface BaseDiff<ID> {
    type: string;
    id: ID;
}

interface Remove<ID> extends BaseDiff<ID> {
    type: 'remove';
}

interface Change<ID, DATA> extends BaseDiff<ID> {
    type: 'change';
    changes: Partial<DATA>;
}

interface Create<ID, DATA> extends BaseDiff<ID> {
    type: 'create';
    data: DATA;
}

export type Diff<ID, DATA> = Remove<ID> | Change<ID, DATA> | Create<ID, DATA>;
