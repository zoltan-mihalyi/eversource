import * as React from 'react';

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
                    <form onSubmit={this.onSubmit}>
                        {loginState.type === 'error' ? (
                            <p>Error: {loginState.message}</p>
                        ) : null}
                        <input name="name"/>
                        <input type="password" name="password"/>
                        <input type="submit" value="Log in"/>
                    </form>
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
        requestFullscreen();
        this.props.onSubmit();
    };

}

function requestFullscreen() {
    const el = document.documentElement as any,
        rfs = el.requestFullscreen
            || el.webkitRequestFullScreen
            || el.mozRequestFullScreen
            || el.msRequestFullscreen;

    rfs.call(el);
}
