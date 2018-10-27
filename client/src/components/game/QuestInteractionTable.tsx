import * as React from 'react';
import { QuestInfo } from '../../../../common/domain/InteractionTable';
import { QuestItemState } from './QuestItemState';

interface Props {
    info: QuestInfo;
    state: QuestItemState;
    onBack: () => void;
    onAccept: () => void;
    onComplete: () => void;
}

export class QuestInteractionTable extends React.PureComponent<Props> {
    render() {
        const { info } = this.props;

        return (
            <>
                <h2>{info.name}</h2>
                {this.renderContent()}

                <button className="item" onClick={this.props.onBack}>Back</button>
                {this.renderButton()}
            </>
        );
    }

    private renderContent(): React.ReactNode {
        const { info, state } = this.props;
        switch (state) {
            case QuestItemState.ACCEPTABLE:
                return (
                    <>
                        <p>{info.description}</p>
                        <h3>Completion</h3>
                        <p>{info.taskDescription}</p>
                        {info.tasks.length === 0 ? null : (
                            <ul className="task-status">
                                {info.tasks.map((task, i) => (
                                    <li key={i}>{task.count !== 1 ? task.count + ' ' : ''}{task.title}</li>
                                ))}
                            </ul>
                        )}
                    </>
                );
            case QuestItemState.COMPLETABLE:
                return (
                    <p>{info.completion}</p>
                );
            case QuestItemState.COMPLETABLE_LATER:
                return (
                    <p>{info.progress}</p>
                );
        }
    }

    private renderButton(): React.ReactNode {
        const { state } = this.props;
        switch (state) {
            case QuestItemState.ACCEPTABLE:
                return (
                    <button className="item" onClick={this.props.onAccept}>Accept</button>
                );
            case QuestItemState.COMPLETABLE:
                return (
                    <button className="item" onClick={this.props.onComplete}>Complete</button>
                );
            case QuestItemState.COMPLETABLE_LATER:
                return null;
        }
    }
}