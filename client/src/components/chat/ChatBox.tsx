import * as React from 'react';
import { injectSheet } from '../utils';
import { StyleRules, WithStyles } from '../interfaces';
import { black, brown } from '../theme';
import { ChatMessage, InventoryAction, QuestStatusAction } from '../../../../common/protocol/Messages';
import { Scrollable } from '../common/Scrollable';
import { CHAT_MESSAGE_MAXIMUM_LENGTH } from '../../../../common/constants';
import { Input } from '../common/Input';
import { ChatMessageRow } from './ChatMessageRow';
import { InventoryActionRow } from './InventoryActionRow';
import { QuestStatusActionRow } from './QuestStatusActionRow';
import CharacterContext from '../context/CharacterContext';

type ClassKeys = 'root' | 'background' | 'content' | 'entry' | 'input';

const styles: StyleRules<ClassKeys> = {
    root: {
        position: 'relative',
        marginLeft: 10,
        marginBottom: 25,
        padding: 5,
    },
    background: {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,

        backgroundColor: brown.darkest,
        opacity: 0.35,
    },
    content: {
        position: 'relative',
        overflowWrap: 'break-word',
        textShadow: `1px 1px 3px ${black}`
    },
    entry: {
        marginLeft: 10,
        textIndent: -10,
        marginTop: 0,
        marginBottom: 0,
    },
    input: {
        width: '100%',
        fontSize: 14,
        boxSizing: 'border-box',
        margin: 0,
        opacity: 0.3,
        '&:focus': {
            opacity: 1,
        },
    },
};

interface ChatMessageEntry {
    type: 'chat';
    message: ChatMessage;
}

export type MessageEntry = ChatMessageEntry | QuestStatusAction | InventoryAction;

interface Props {
    inputRef?: React.Ref<HTMLInputElement>;
    messages: MessageEntry[];
    sendMessage: (message: string) => void;
}

interface State {
    message: string;
}

export class RawChatBox extends React.PureComponent<Props & WithStyles<ClassKeys>> {
    private input: HTMLInputElement | null = null;

    state: State = {
        message: '',
    };

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <div className={classes.background}/>
                <div className={classes.content}>
                    <Scrollable autoScroll>
                        {this.props.messages.map((message, i) => (
                            <p key={i} className={classes.entry}>
                                {renderMessageEntry(message)}
                            </p>
                        ))}
                    </Scrollable>

                    <form onSubmit={this.sendMessage}>
                        <Input ref={this.handleRef} value={this.state.message} className={classes.input} size={1}
                               maxLength={CHAT_MESSAGE_MAXIMUM_LENGTH} onChange={this.changeMessage}
                               onKeyDown={this.onKeyDown}/>
                    </form>
                </div>
            </div>
        );
    }

    private canSend() {
        return this.state.message !== '';
    }

    private changeMessage = (e: React.SyntheticEvent<HTMLInputElement>) => {
        this.setState({ message: e.currentTarget.value });
    };

    private sendMessage = (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        this.input!.blur();

        if (!this.canSend()) {
            return;
        }

        this.props.sendMessage(this.state.message);
        this.setState({ message: '' });
    };

    private handleRef = (input: HTMLInputElement | null) => {
        this.input = input;
        const { inputRef } = this.props;
        if (typeof inputRef === 'function') {
            inputRef(input);
        } else if (inputRef) {
            (inputRef as { current: HTMLInputElement | null }).current = input;
        }
    };

    private onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.which === 27) {
            event.currentTarget.blur();
        }
    }
}

export const ChatBox = injectSheet(styles)(RawChatBox);

function renderMessageEntry(messageEntry: MessageEntry): React.ReactNode {
    switch (messageEntry.type) {
        case 'chat':
            return (
                <ChatMessageRow message={messageEntry.message}/>
            );
        case 'inventory':
            return (
                <InventoryActionRow action={messageEntry}/>
            );
        case 'quest-status':
            return (
                <CharacterContext.Consumer>
                    {(character) => (
                        <QuestStatusActionRow playerLevel={character.level} action={messageEntry}/>
                    )}
                </CharacterContext.Consumer>
            );
    }
}