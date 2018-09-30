import * as React from 'react';
import { Button } from '../gui/Button';

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
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                this.setState({
                    content: xhttp.responseText,
                });
            }
        };
        xhttp.open('GET', 'dist/authors.html', true);
        xhttp.send();
    }

    render() {
        return (
            <div className="gui">
                <div className="credits container" dangerouslySetInnerHTML={{ __html: this.state.content }}/>
                <div className="credits-back">
                    <Button onClick={this.props.onExit}>Back</Button>
                </div>
            </div>
        );
    }
}