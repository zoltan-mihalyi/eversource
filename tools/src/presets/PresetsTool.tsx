import * as fs from 'fs';
import * as React from 'react';
import { createView, EditProps, ShowPreset } from './ShowPreset';
import { BasePreset } from '../../../server/src/world/Presets';

interface Props<T> {
    file: string;
    canCast: boolean;
    defaultPreset: T;
    Edit: React.ComponentType<EditProps<T>>;
    createView: createView<T>;
    onExit: () => void;
}

interface State<T> {
    presets: { [name: string]: T };
    selected: string | null;
    modified: boolean;
}

export class PresetsTool<T extends BasePreset> extends React.Component<Props<T>, State<T>> {
    private addName = React.createRef<HTMLInputElement>();

    constructor(props: Props<T>) {
        super(props);
        const presets = JSON.parse(fs.readFileSync(this.getFileName(), 'utf-8'));
        this.state = { presets, selected: null, modified: false };
    }

    render() {
        const { Edit, canCast } = this.props;

        const { presets, selected, modified } = this.state;
        if (selected) {
            return (<ShowPreset name={selected} save={this.savePreset} exit={this.exit} canCast={canCast} Edit={Edit}
                                createView={this.props.createView} originalPreset={presets[selected]}/>);
        }

        return (
            <div className="menu">
                <button className="big" disabled={!modified} onClick={this.save}>Save</button>
                <button className="big exit" onClick={this.props.onExit}>X</button>
                <div>
                    <input style={{ width: 200 }} className="big" ref={this.addName}/>
                    <button className="big" onClick={this.add}>+</button>
                </div>
                <ul>
                    {Object.keys(presets).map((name) => (
                        <li key={name}>
                            <button onClick={() => this.rename(name)}>Rename</button>
                            <button onClick={() => this.delete(name)}>X</button>
                            <a className={name === selected ? 'selected' : ''} href="#"
                               onClick={() => this.select(name)}>{name}</a>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }

    private savePreset = (preset: T) => {
        const { presets, selected } = this.state;
        this.setState({
            presets: {
                ...presets,
                [selected!]: preset,
            },
        }, this.save);
    };

    private save = () => {
        this.setState({ modified: false });
        fs.writeFileSync(this.getFileName(), JSON.stringify(this.state.presets, null, 2));
    };

    private exit = () => {
        this.setState({
            selected: null,
        });
    };

    private delete(name: string) {
        if (!confirm('Delete ' + name + '?')) {
            return;
        }
        const presets = {
            ...this.state.presets,
        };
        delete presets[name];
        const { selected } = this.state;
        this.setState({
            presets,
            selected: selected === name ? null : selected,
            modified: true,
        });
    }

    private rename(name: string) {
        const newName = prompt('New name', name);
        if (name === newName || !newName) {
            return;
        }

        if (this.state.presets[newName]) {
            alert('Already exists!');
            return;
        }

        const presets: { [name: string]: T } = {};
        for (const key of Object.keys(this.state.presets)) {
            presets[key === name ? newName : key] = this.state.presets[key];
        }
        this.setState({
            presets,
            modified: true,
        });
    }

    private add = () => {
        const preset = this.props.defaultPreset;

        const name = this.addName.current!.value;

        if (name === '') {
            return;
        }
        if (this.state.presets[name]) {
            alert('Already exists');
            return;
        }
        this.setState({
            presets: {
                ...this.state.presets,
                [name]: preset,
            },
            selected: name,
        });

    };

    private select(name: string) {
        this.setState({ selected: name });
    }

    private getFileName() {
        return `../server/data/presets/${this.props.file}.json`;
    }
}