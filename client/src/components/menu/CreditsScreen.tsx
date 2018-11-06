import * as React from 'react';
import { Button } from '../gui/Button';
import { ajax } from '../../utils';

interface Props {
    onExit: () => void;
}

interface State {
    content: string;
}

export class CreditsScreen extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            content: '',
        };
    }

    componentDidMount() {
        ajax('dist/authors.html', (responseText) => {
            this.setState({
                content: responseText,
            });
        });
    }

    render() {
        return (
            <div className="gui">
                <div className="credits container panel">
                    <div className="content" dangerouslySetInnerHTML={{ __html: this.state.content }}/>
                </div>
                <div className="credits-back">
                    <Button onClick={this.props.onExit}>Back</Button>
                </div>
            </div>
        );
    }
}