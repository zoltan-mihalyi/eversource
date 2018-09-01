import * as React from 'react';
import { CharacterId, CharacterInfo } from '../../../../common/domain/CharacterInfo';

interface Props {
    startLoading: (id: CharacterId) => void;
    exit: () => void;
    characters: CharacterInfo[];
}

export class CharacterSelectionScreen extends React.Component<Props> {
    render() {
        const { startLoading, exit, characters } = this.props;

        return (
            <>
                <ul>
                    {characters.map((character, idx) => (
                        <li key={idx}>
                            {character.name} {' the '} {character.classId} {' '}
                            <button onClick={() => startLoading(character.id)}>enter</button>
                        </li>
                    ))}
                </ul>
                <button onClick={exit}>exit</button>
            </>
        );
    }
}