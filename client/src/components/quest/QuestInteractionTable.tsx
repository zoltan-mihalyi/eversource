import * as React from 'react';
import { QuestInfo } from '../../../../common/domain/InteractionTable';
import { QuestItemState } from './QuestItemState';
import { Rewards } from './Rewards';
import { QuestContent } from './QuestContent';
import { Scrollable } from '../common/Scrollable';
import { ActionButton } from '../common/Button/ActionButton';
import { QuestStyle } from './QuestStyle';
import { ResolvedText } from './ResolvedText';
import { QuestRequirements } from './QuestRequirements';

interface Props {
    info: QuestInfo;
    state: QuestItemState;
    onBack: () => void;
    onAccept: () => void;
    onComplete: (selectedRewards: number[]) => void;
}

interface State {
    selectedRewards: number[];
    lastInfo: QuestInfo;
}

export class QuestInteractionTable extends React.PureComponent<Props, State> {
    static getDerivedStateFromProps(props: Props, state: State | null): State | null {
        if (state && state.lastInfo === props.info) {
            return null;
        }

        const selectedRewards = props.info.rewards.map(({ options }) => options.length === 1 ? 0 : -1);
        return {
            selectedRewards,
            lastInfo: props.info,
        };
    }

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
        const { selectedRewards } = this.state;
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
                        <QuestRequirements requirements={info.requirements}/>
                        <Rewards info={info} selectedRewards={selectedRewards} selectReward={this.selectReward}/>
                    </QuestStyle>
                );
            case QuestItemState.COMPLETABLE_LATER:
                return (
                    <QuestStyle>
                        <h2>{info.name}</h2>
                        <ResolvedText text={info.progress!}/>
                        <QuestRequirements requirements={info.requirements}/>
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
                    <ActionButton onClick={this.complete}>Complete</ActionButton>
                );
            case QuestItemState.COMPLETABLE_LATER:
                return null;
        }
    }

    private selectReward = (selectedRewards: number[]) => {
        this.setState({ selectedRewards });
    };

    private complete = () => {
        this.props.onComplete(this.state.selectedRewards);
    };
}
