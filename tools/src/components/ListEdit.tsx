import * as React from 'react';
import { ItemEdit } from './ItemEdit';
import * as fs from "fs";
import { EditProps } from './edit/Edit';

interface Props<T> {
    fileName: string;
    defaultItem: T;
    onExit: () => void;
    EditComponent: React.ComponentType<EditProps<T>>;
}

interface State<T> {
    selected: string | null;
    items: { [name: string]: T };
    modified: boolean;
}

export class ListEdit<T> extends React.PureComponent<Props<T>, State<T>> {
    private addName = React.createRef<HTMLInputElement>();

    constructor(props: Props<T>) {
        super(props);

        const items = JSON.parse(fs.readFileSync(props.fileName, 'utf-8'));
        this.state = { items, selected: null, modified: false };
    }


    render() {
        const { EditComponent } = this.props;
        const { items, selected, modified } = this.state;

        if (selected) {
            return (
                <ItemEdit name={selected} exit={this.exit} save={this.saveItem} originalItem={items[selected]}
                          EditComponent={EditComponent}/>
            );
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
                    {Object.keys(items).map((name) => (
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

    private save = () => {
        this.setState({ modified: false });
        fs.writeFileSync(this.props.fileName, JSON.stringify(this.state.items, null, 2));
    };

    private rename(name: string) {
        const newName = prompt('New name', name);
        if (name === newName || !newName) {
            return;
        }

        if (this.state.items[newName]) {
            alert('Already exists!');
            return;
        }

        const items: { [name: string]: T } = {};
        for (const key of Object.keys(this.state.items)) {
            items[key === name ? newName : key] = this.state.items[key];
        }
        this.setState({
            items,
            modified: true,
        });
    }

    private add = () => {
        const item = this.props.defaultItem;

        const name = this.addName.current!.value;

        if (name === '') {
            return;
        }
        if (this.state.items[name]) {
            alert('Already exists');
            return;
        }
        this.setState((state) => ({
            items: {
                ...state.items,
                [name]: item,
            },
            selected: name,
        }));

    };

    private exit = () => {
        this.setState({
            selected: null,
        });
    };

    private saveItem = (item: T) => {
        const { items, selected } = this.state;
        this.setState({
            items: {
                ...items,
                [selected!]: item,
            },
        }, this.save);
    };

    private delete(name: string) {
        if (!confirm('Delete ' + name + '?')) {
            return;
        }
        const items = {
            ...this.state.items,
        };
        delete items[name];
        const { selected } = this.state;
        this.setState({
            items,
            selected: selected === name ? null : selected,
            modified: true,
        });
    }

    private select(name: string) {
        this.setState({ selected: name });
    }

}
