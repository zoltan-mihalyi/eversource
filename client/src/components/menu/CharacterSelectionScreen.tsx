import * as React from 'react';
import { CharacterInfo } from '../../../../common/domain/CharacterInfo';

interface Props {
    startLoading: (character: CharacterInfo) => void;
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
                            {`${character.name} the ${character.classId} @${character.location.zoneId} `}
                            <button onClick={() => startLoading(character)}>enter</button>
                        </li>
                    ))}
                </ul>
                <button onClick={exit}>exit</button>
            </>
        );
    }
}