import * as React from 'react';
import { Button } from '../gui/Button';

interface Props {
    onSubmit: (username: string, password: string) => void;
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


export class LoginScreen extends React.Component<Props> {
    private usernameInput = React.createRef<HTMLInputElement>();
    private passwordInput = React.createRef<HTMLInputElement>();
    render() {
        return (
            <div className="gui">
                <h1>Eversource</h1>
                {this.renderContent()}
            </div>
        );
    }

    private renderContent() {
        const { loginState } = this.props;

        switch (loginState.type) {
            case  'initial':
            case 'error':
                return (
                    <form className="container" onSubmit={this.onSubmit}>
                        {loginState.type === 'error' ? (
                            <p>Error: {loginState.message}</p>
                        ) : null}
                        <div className="center">
                            <input name="username" placeholder="username" ref={this.usernameInput}/>
                        </div>
                        <div className="center">
                            <input type="password" name="password" placeholder="password" ref={this.passwordInput}/>
                        </div>
                        <div className="center">
                            <Button>Log in</Button>
                        </div>
                    </form>
                );
            case 'connecting':
                return (
                    <div className="container">
                        <h2>Connecting...</h2>
                    </div>
                );
            case 'characters':
                return (
                    <div className="container">
                        <h2>Loading characters...</h2>
                    </div>
                );
        }
    }

    private onSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        const {usernameInput, passwordInput} = this;
        this.props.onSubmit(usernameInput.current!.value, passwordInput.current!.value);
    };

}
