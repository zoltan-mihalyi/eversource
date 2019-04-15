import { Position, X, Y } from '../../common/domain/Location';
import { QuestIndexer } from '../src/quest/QuestIndexer';
import { DataContainer } from '../src/data/DataContainer';

export function position(x: number, y: number): Position {
    return {
        x: x as X,
        y: y as Y,
    };
}

export function fakeDataContainer(replace?: Partial<DataContainer>): DataContainer {
    return {
        spells: {},
        humanoid: {},
        monster: {},
        object: {},
        items: {},
        questIndexer: new QuestIndexer({}, {}),
        ...replace,
    };
}
