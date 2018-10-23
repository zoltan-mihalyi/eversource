import * as React from 'react';

interface Props {
    zone: string;
}

export class LoadingScreen extends React.Component<Props> {
    render() {
        return (
            <div className="gui">
                <div className="container panel">
                    <h2>Loading...</h2>
                    <h3 className="secondary">{this.props.zone}</h3>
                </div>
            </div>
        );
    }
}