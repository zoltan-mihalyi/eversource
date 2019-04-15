import * as React from 'react';
import { ActionButton } from '../common/Button/ActionButton';
import { Gui } from '../common/Gui';
import { Panel } from '../common/Panel';
import { injectSheet } from '../utils';
import { StyleRules, WithStyles } from '../interfaces';
import { black, brown } from '../theme';

type ClassKeys = 'root' | 'container' | 'actionContainer' | 'content';

const style: StyleRules<ClassKeys> = {
    root: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
    },
    container: {
        display: 'flex',
        flex: 1,
        overflow: 'hidden',
    },
    actionContainer: {
        display: 'flex',
        flexGrow: 0,
        flexShrink: 0,
        flexBasis: 60,
    },
    content: {
        height: '100%',
        overflow: 'auto',
        textAlign: 'center',

        '& a': {
            color: brown.normalDark,
        },

        '& p': {
            color: black,
            marginTop: '0.5em',
            marginBottom: '0.5em',
        },

        '& ul': {
            listStyleType: 'none',
            paddingLeft: 0,
        }
    }
};

interface Props {
    onExit: () => void;
}

interface State {
    content: string;
}

class RawCreditsScreen extends React.Component<Props & WithStyles<ClassKeys>, State> {
    state: State = {
        content: '',
    };

    componentDidMount() {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                this.setState({
                    content: xhttp.responseText,
                });
            }
        };
        xhttp.open('GET', 'dist/authors.html', true);
        xhttp.send();
    }

    render() {
        const { classes } = this.props;

        return (
            <Gui>
                <div className={classes.root}>
                    <div className={classes.container}>
                        <Panel margin padding>
                            <div className={classes.content} dangerouslySetInnerHTML={{ __html: this.state.content }}/>
                        </Panel>
                    </div>
                    <div className={classes.actionContainer}>
                        <div>
                            <ActionButton onClick={this.props.onExit}>Back</ActionButton>
                        </div>
                    </div>
                </div>
            </Gui>
        );
    }
}

export const CreditsScreen = injectSheet(style)(RawCreditsScreen);
