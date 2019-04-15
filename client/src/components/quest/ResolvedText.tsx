import { CharacterState } from '../../../../common/protocol/PlayerState';
import * as React from 'react';
import CharacterContext from '../context/CharacterContext';

interface Props {
    text: string;
}

export const ResolvedText: React.FunctionComponent<Props> = ({ text }) => (
    <p>
        <CharacterContext.Consumer>
            {(character) => resolve(text, character)}
        </CharacterContext.Consumer>
    </p>
);

function resolve(text: string, info: CharacterState): string {
    return text.replace(/%name%|%sex%|%class%/g, (substring) => {
        switch (substring) {
            case '%name%':
                return info.name;
            case '%sex%':
                return info.sex === 'male' ? 'man' : 'woman';
            case '%class%':
                return info.classId;
        }
        return substring;
    });
}
