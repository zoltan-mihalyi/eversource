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
        const { loginState } = this.props;
        switch (loginState.type) {
            case  'initial':
            case 'error':
                return (
                    <div className="gui">
                        <h1>Eversource</h1>
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
                    </div>
                );
            case 'connecting':
                return (
                    <p>connecting...</p>
                );
            case 'characters':
                return (
                    <p>querying characters...</p>
                );
        }
    }

    private onSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        this.props.onSubmit();
    };

}
