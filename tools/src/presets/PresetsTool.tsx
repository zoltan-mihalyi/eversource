import * as fs from 'fs';
import * as React from 'react';
import { ShowCharacter } from './ShowCharacter';
import { HumanoidPreset, HumanoidPresets } from '../../../server/src/world/Presets';

const PRESETS_JSON = '../server/data/presets.json';

interface Props {
    onExit: () => void;
}

interface State {
    presets: HumanoidPresets;
    selected: string | null;
    modified: boolean;
}

export class PresetsTool extends React.Component<Props, State> {
    private addName = React.createRef<HTMLInputElement>();

    constructor(props: Props) {
        super(props);
        const presets = JSON.parse(fs.readFileSync(PRESETS_JSON, 'utf-8'));
        this.state = { presets, selected: null, modified: false };
    }

    render() {
        const { presets, selected, modified } = this.state;
        if (selected) {
            return (<ShowCharacter name={selected} save={this.savePreset} exit={this.exit}
                                   originalPreset={presets[selected]}/>);
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

    private savePreset = (preset: HumanoidPreset) => {
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
        fs.writeFileSync(PRESETS_JSON, JSON.stringify(this.state.presets, null, 2));
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

        const presets: HumanoidPresets = {};
        for (const key of Object.keys(this.state.presets)) {
            presets[key === name ? newName : key] = this.state.presets[key];
        }
        this.setState({
            presets,
            modified: true,
        });
    }

    private add = () => {
        const preset: HumanoidPreset = {
            name: 'Fill Me',
            appearance: {
                sex: 'female',
                body: ['tanned'],
                nose: [],
                hair: [],
                eyes: [],
                ears: [],
            },
            equipment: {
                shirt: [],
                legs: [],
                head: [],
                cape: [],
                belt: [],
                arms: [],
                hands: [],
                feet: [],
                chest: [],
            },
        };

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
}