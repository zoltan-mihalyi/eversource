import * as React from 'react';
import { QuestInfo } from '../../../../common/domain/InteractionTable';
import { QuestItemState } from './QuestItemState';
import { InteractionItemButton } from '../common/Button/InteractionItemButton';
import { className, injectSheet, SMALL_DEVICE } from '../utils';
import { StyleRules, WithStyles } from '../interfaces';
import { quest } from '../theme';

interface Props {
    state: QuestItemState;
    quest: QuestInfo;
    onSelect: (id: QuestInfo) => void;
}

type ClassKeys = 'root' | 'active' | 'inactive';

const styles: StyleRules<ClassKeys> = {
    root: {
        textShadow: '0 0 1px black',
        display: 'inline-block',
        width: 20,

        [SMALL_DEVICE]: {
            width: 10,
        }
    },
    active: {
        color: quest.active,
    },
    inactive: {
        color: quest.inactive,
    }
};

class RawInteractionItem extends React.Component<Props & WithStyles<ClassKeys>> {
    render() {
        const { state, quest, classes } = this.props;

        return (
            <li>
                <InteractionItemButton onClick={this.onSelect}>
                    <span className={className(classes.root, state === QuestItemState.COMPLETABLE_LATER ? classes.inactive : classes.active)}>
                        {state === QuestItemState.ACCEPTABLE ? '! ' : '? '}
                    </span>
                    {quest.name}
                </InteractionItemButton>
            </li>
        );
    }

    private onSelect = () => {
        this.props.onSelect(this.props.quest);
    };
}

export const InteractionItem = injectSheet(styles)(RawInteractionItem);
