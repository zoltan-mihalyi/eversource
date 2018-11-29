import * as React from 'react';

interface Props {
    onClose: () => void;
}

export class CloseButton extends React.Component<Props> {
    render() {
        return (
            <button className="close" onClick={this.props.onClose}>X</button>
        );
    }
}