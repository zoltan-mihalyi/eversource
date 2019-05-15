import * as React from 'react';
import { ChatMessage } from '../../../../common/protocol/Messages';
import { StyleRules, WithStyles } from '../interfaces';
import { brown, player } from '../theme';
import { injectSheet } from '../utils';

type ClassKeys = 'sender' | 'message';

const styles: StyleRules<ClassKeys> = {
    sender: {
        color: player,
    },
    message: {
        color: brown.lightest,
        marginLeft: 8,
    },
};

interface Props {
    message: ChatMessage;
}

const RawChatMessageRow: React.FunctionComponent<Props & WithStyles<ClassKeys>> = ({ message, classes }) => (
    <>
        <span className={classes.sender}>{message.sender}</span>
        <span className={classes.message}>{message.text}</span>
    </>
);

export const ChatMessageRow = injectSheet(styles)(RawChatMessageRow);
