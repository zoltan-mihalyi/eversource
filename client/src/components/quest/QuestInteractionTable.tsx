import * as React from 'react';
import { QuestInfo } from '../../../../common/domain/InteractionTable';
import { QuestItemState } from './QuestItemState';
import { Rewards } from './Rewards';
import { QuestContent } from './QuestContent';
import { Scrollable } from '../common/Scrollable';
import { ActionButton } from '../common/Button/ActionButton';
import { QuestStyle } from './QuestStyle';
import { ResolvedText } from './ResolvedText';

interface Props {
    info: QuestInfo;
    state: QuestItemState;
    onBack: () => void;
    onAccept: () => void;
    onComplete: () => void;
}

export class QuestInteractionTable extends React.PureComponent<Props> {
    render() {
        return (
            <>
                <Scrollable variant="paper" padding fixedHeight>
                    {this.renderContent()}
                </Scrollable>

                <div>
                    <ActionButton onClick={this.props.onBack}>Back</ActionButton>
                    {this.renderButton()}
                </div>
            </>
        );
    }

    private renderContent(): React.ReactNode {
        const { info, state } = this.props;
        switch (state) {
            case QuestItemState.ACCEPTABLE:
                return (
                    <QuestContent info={info}/>
                );
            case QuestItemState.COMPLETABLE:
                return (
                    <QuestStyle>
                        <h2>{info.name}</h2>
                        <ResolvedText text={info.completion}/>
                        <Rewards info={info}/>
                    </QuestStyle>
                );
            case QuestItemState.COMPLETABLE_LATER:
                return (
                    <QuestStyle>
                        <h2>{info.name}</h2>
                        <ResolvedText text={info.progress!}/>
                    </QuestStyle>
                );
        }
    }

    private renderButton(): React.ReactNode {
        const { state } = this.props;
        switch (state) {
            case QuestItemState.ACCEPTABLE:
                return (
                    <ActionButton onClick={this.props.onAccept}>Accept</ActionButton>
                );
            case QuestItemState.COMPLETABLE:
                return (
                    <ActionButton onClick={this.props.onComplete}>Complete</ActionButton>
                );
            case QuestItemState.COMPLETABLE_LATER:
                return null;
        }
    }
}
