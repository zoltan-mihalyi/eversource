import * as React from 'react';

interface Props {
    zone: string;
}

export class LoadingScreen extends React.Component<Props> {
    render() {
        return (
            <p>Loading {this.props.zone}...</p>
        );
    }
}