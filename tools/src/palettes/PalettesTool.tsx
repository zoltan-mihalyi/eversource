import * as React from 'react';
import { PalettesEditor } from './PalettesEditor';
import { openFileDialog } from '../Utils';

interface Props {
    onExit: () => void;
}

interface State {
    editing: boolean;
    filename: string | null;
}

export class PalettesTool extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            editing: false,
            filename: null,
        };
    }


    render() {
        const { editing, filename } = this.state;
        if (editing) {
            return <PalettesEditor defaultFilename={filename} close={this.close}/>
        }

        return (
            <div>
                <button className="big exit" onClick={this.props.onExit}>X</button>
                <button className="big" onClick={this.open}>Open</button>
                <button className="big" onClick={this.create}>Create</button>
            </div>
        );
    }

    private close = () => {
        this.setState({ editing: false, filename: null })
    };

    private open = () => {
        openFileDialog((filename) => {
            this.setState({ editing: true, filename });
        });
    };

    private create = () => {
        this.setState({ editing: true, filename: null });
    };
}