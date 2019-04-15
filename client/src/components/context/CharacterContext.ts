import * as React from 'react';
import { CharacterState } from '../../../../common/protocol/PlayerState';

export const EMPTY_CHARACTER: CharacterState = {
    level: 1,
    xp: 0,
    name: '',
    classId: 'warrior',
    sex: 'male',
    inventorySize: 0,
};

export default React.createContext<CharacterState>(EMPTY_CHARACTER);
