import * as React from 'react';
import { CharacterInfo } from '../../../../common/domain/CharacterInfo';
import { Gui } from '../common/Gui';
import { ActionButton } from '../common/Button/ActionButton';
import { List } from '../common/List';
import { ListItem } from '../common/List/ListItem';
import { Panel } from '../common/Panel';
import { Centered } from '../common/Centered';
import { Scrollable } from '../common/Scrollable';
import { CharacterInfoBox } from '../character/CharacterInfoBox';

interface Props {
    onSelect: (character: CharacterInfo) => void;
    onExit: () => void;
    characters: CharacterInfo[];
}

export class CharacterSelectionScreen extends React.Component<Props> {
    render() {
        const { onSelect, onExit, characters } = this.props;

        return (
            <Gui>
                <Centered>
                    <Panel margin padding>
                        <Scrollable>
                            <List bordered>
                                {characters.map((character, idx) => (
                                    <ListItem key={idx} onClick={() => onSelect(character)}>
                                        <CharacterInfoBox character={character}/>
                                    </ListItem>
                                ))}
                            </List>
                        </Scrollable>
                        <Centered>
                            <ActionButton onClick={onExit}>Exit</ActionButton>
                        </Centered>
                    </Panel>
                </Centered>
            </Gui>
        );
    }
}
