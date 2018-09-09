import * as React from 'react';
import { CharacterInfo } from '../../../../common/domain/CharacterInfo';
import { Button } from '../gui/Button';

interface Props {
    startLoading: (character: CharacterInfo) => void;
    exit: () => void;
    characters: CharacterInfo[];
}

export class CharacterSelectionScreen extends React.Component<Props> {
    render() {
        const { startLoading, exit, characters } = this.props;

        return (
            <div className="gui">
                <div className="container">
                    <ul>
                        {characters.map((character, idx) => (
                            <li key={idx}>
                                <button onClick={() => startLoading(character)}>
                                    <h2>{character.name}</h2>
                                    <h3>Level 1 {character.classId}</h3>
                                    <h3 className="secondary">{character.location.zoneId}</h3>
                                </button>
                            </li>
                        ))}
                    </ul>
                    <div className="center">
                        <Button onClick={exit}>exit</Button>
                    </div>
                </div>
            </div>
        );
    }
}