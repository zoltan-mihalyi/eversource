import * as React from 'react';
import { Button } from '../gui/Button';

interface Props {
    onSubmit: () => void;
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
                            <input name="name" placeholder="name"/>
                        </div>
                        <div className="center">
                            <input type="password" name="password" placeholder="password"/>
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
        this.props.onSubmit();
    };

}
