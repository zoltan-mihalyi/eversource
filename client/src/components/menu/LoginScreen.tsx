import * as React from 'react';
import { Button } from '../gui/Button';
import { settings } from '../../settings/SettingsStore';

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

export class LoginScreen extends React.Component<Props, State> {
    private passwordInput = React.createRef<HTMLInputElement>();

    constructor(props: Props) {
        super(props);

        const username = settings.get('username');
        this.state = {
            username: username || '',
            saveUsername: username !== null,
        };
    }

    render() {
        return (
            <div className="gui">
                <h1>Eversource</h1>
                {this.renderContent()}
            </div>
        );
    }

    private renderContent() {
        const { loginState, showCredits } = this.props;

        const { username, saveUsername } = this.state;

        switch (loginState.type) {
            case  'initial':
            case 'error':
                return (
                    <>
                        <form className="container panel" onSubmit={this.onSubmit}>
                            <div className="content">
                                {loginState.type === 'error' ? (
                                    <p>Error: {loginState.message}</p>
                                ) : null}
                                <div className="center">
                                    <input autoFocus={true} name="username" value={username} placeholder="username"
                                           onChange={this.usernameChanged}/>
                                </div>
                                <div className="center">
                                    <input type="password" name="password" placeholder="password"
                                           ref={this.passwordInput}/>
                                </div>
                                <div className="center">
                                    <Button>Log in</Button>
                                </div>
                                <div>
                                    <label>
                                        <input type="checkbox" id="save-username" onChange={this.saveUsernameChanged}
                                               disabled={username === ''} checked={saveUsername}/>
                                        <span>Save user name</span>
                                    </label>
                                </div>
                            </div>
                        </form>

                        <div className="center">
                            <Button onClick={showCredits}>Credits</Button>
                        </div>
                    </>
                );
            case 'connecting':
                return (
                    <div className="container panel">
                        <div className="content">
                            <h2>Connecting...</h2>
                        </div>
                    </div>
                );
            case 'characters':
                return (
                    <div className="container panel">
                        <div className="content">
                            <h2>Loading characters...</h2>
                        </div>
                    </div>
                );
        }
    }

    private changeUsernameSave(saveUsername: string | null) {
        this.setState({
            saveUsername: saveUsername !== null
        });
        settings.set('username', saveUsername);
    }

    private usernameChanged = (e: React.SyntheticEvent<HTMLInputElement>) => {
        this.changeUsernameSave(null);
        this.setState({ username: e.currentTarget.value });
    };

    private saveUsernameChanged = (e: React.SyntheticEvent<HTMLInputElement>) => {
        this.changeUsernameSave(e.currentTarget.checked ? this.state.username : null);
    };

    private onSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { passwordInput } = this;
        this.props.onSubmit(this.state.username, passwordInput.current!.value);
    };

}
