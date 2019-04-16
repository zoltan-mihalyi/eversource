import * as React from 'react';
import { settings } from '../../settings/SettingsStore';
import { Gui } from '../common/Gui';
import { injectSheet, SMALL_DEVICE, SMALLEST_DEVICE } from '../utils';
import { StyleRules, WithStyles } from '../interfaces';
import { brown } from '../theme';
import { Panel } from '../common/Panel';
import { Centered } from '../common/Centered';
import { Input } from '../common/Input';
import { ActionButton } from '../common/Button/ActionButton';
import { Checkbox } from '../common/Input/Checkbox';

type ClassKeys = 'title' | 'action' | 'hidden';

const styles: StyleRules<ClassKeys> = {
    title: {
        textAlign: 'center',
        color: brown.lighter,
        fontSize: 96,
        marginBottom: 120,

        [SMALL_DEVICE]: {
            fontSize: 64,
            marginBottom: 60,
        },
        [SMALLEST_DEVICE]: {
            fontSize: 32,
            marginBottom: 20,
        },

        '@media (min-aspect-ratio: 4/5) and (max-width:800px)': {
            marginTop: 20,
            marginBottom: 20,
        },
    },
    action: {
        marginTop: 20,
    },
    hidden: {
        display: 'none',
    },
};

interface Props {
    onSubmit: (username: string, password: string) => void;
    showCredits: () => void;
    loginState: LoginState;
}

type SimpleState<T> = {
    type: T;
}

type ErrorState = {
    type: 'error';
    message: string;
}

export type LoginState = SimpleState<'initial'>
    | SimpleState<'connecting'>
    | SimpleState<'characters'>
    | ErrorState;

interface State {
    username: string;
    saveUsername: boolean;
}

class RawLoginScreen extends React.Component<Props & WithStyles<ClassKeys>, State> {
    private form = React.createRef<HTMLFormElement>();
    private passwordInput = React.createRef<HTMLInputElement>();

    constructor(props: Props & WithStyles<ClassKeys>) {
        super(props);

        const username = settings.get('username');
        this.state = {
            username: username || '',
            saveUsername: username !== null,
        };
    }

    render() {
        return (
            <Gui>
                <h1 className={this.props.classes.title}>Eversource</h1>

                <Centered>
                    {this.renderContent()}
                </Centered>
            </Gui>
        );
    }

    private renderContent() {
        const { loginState, showCredits, classes } = this.props;

        const { username, saveUsername } = this.state;

        switch (loginState.type) {
            case  'initial':
            case 'error':
                return (
                    <>
                        <Panel padding>
                            <form ref={this.form} onSubmit={this.onSubmit}>
                                {loginState.type === 'error' ? (
                                    <p>Error: {loginState.message}</p>
                                ) : null}
                                <Centered>
                                    <Input autoFocus={true} name="username" value={username} placeholder="username"
                                           onChange={this.usernameChanged}/>
                                </Centered>
                                <Centered>
                                    <Input type="password" name="password" placeholder="password"
                                           ref={this.passwordInput}/>
                                </Centered>
                                <Centered>
                                    <div className={classes.action}>
                                        <ActionButton onClick={this.submit}>Log in</ActionButton>
                                    </div>
                                </Centered>
                                <div>
                                    <Checkbox onChange={this.saveUsernameChanged} disabled={username === ''} checked={saveUsername}>
                                        Save user name
                                    </Checkbox>
                                </div>
                                <input type="submit" className={classes.hidden}/>
                            </form>
                        </Panel>

                        <div className={classes.action}>
                            <ActionButton onClick={showCredits}>Credits</ActionButton>
                        </div>
                    </>
                );
            case 'connecting':
                return (
                    <Panel padding>
                        <h2>Connecting...</h2>
                    </Panel>
                );
            case 'characters':
                return (
                    <Panel padding>
                        <h2>Loading characters...</h2>
                    </Panel>
                );
        }
    }

    private changeUsernameSave(saveUsername: string | null) {
        this.setState({
            saveUsername: saveUsername !== null,
        });
        settings.set('username', saveUsername);
    }

    private usernameChanged = (e: React.SyntheticEvent<HTMLInputElement>) => {
        this.changeUsernameSave(null);
        this.setState({ username: e.currentTarget.value });
    };

    private saveUsernameChanged = (checked: boolean) => {
        this.changeUsernameSave(checked ? this.state.username : null);
    };

    private submit = () => {
        this.form.current!.dispatchEvent(new Event('submit', { cancelable: true }));
    };

    private onSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { passwordInput } = this;
        this.props.onSubmit(this.state.username, passwordInput.current!.value);
    };

}

export const LoginScreen = injectSheet(styles)(RawLoginScreen);
