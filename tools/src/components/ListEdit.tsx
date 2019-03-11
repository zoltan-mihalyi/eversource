import * as React from 'react';
import { ItemEdit } from './ItemEdit';
import * as fs from "fs";
import { EditProps } from './edit/Edit';
import { ListEditRow } from './ListEditRow';

interface Named {
    name: string;
}

interface Props<T> {
    fileName: string;
    defaultItem: T;
    onExit: () => void;
    EditComponent: React.ComponentType<EditProps<T>>;
}

interface State<T> {
    search: string;
    selected: string | null;
    items: Items<T>;
    modified: boolean;
}

type Items<T> = { [name: string]: T };

export class ListEdit<T extends Named> extends React.PureComponent<Props<T>, State<T>> {
    private addName = React.createRef<HTMLInputElement>();

    constructor(props: Props<T>) {
        super(props);

        const items = JSON.parse(fs.readFileSync(props.fileName, 'utf-8'));
        this.state = { items, selected: null, modified: false, search: '' };
    }


    render() {
        const { EditComponent } = this.props;
        const { items, selected, modified, search } = this.state;

        if (selected) {
            return (
                <ItemEdit name={selected} exit={this.exit} save={this.saveItem} originalItem={items[selected]}
                          EditComponent={EditComponent}/>
            );
        }

        const filteredItems = this.getFilteredItems();
        const ids = Object.keys(filteredItems).sort(numberOrStringSorter);

        return (
            <div className="menu">
                <button className="big" disabled={!modified} onClick={this.save}>Save</button>
                <button className="big exit" onClick={this.props.onExit}>X</button>
                <div>
                    <input value={search} style={{ width: 200 }} className="big" onChange={this.changeSearch}
                           placeholder="search"/>
                    &nbsp;
                    <input style={{ width: 200 }} className="big" ref={this.addName} placeholder="add"/>
                    <button className="big" onClick={this.add}>+</button>
                </div>
                <table>
                    <tbody>
                    {ids.map((id) => (
                        <ListEditRow key={id} id={id} name={filteredItems[id].name} remove={this.remove}
                                     rename={this.rename}
                                     copy={this.copy} select={this.select}/>
                    ))}
                    </tbody>
                </table>
            </div>
        );
    }

    private getFilteredItems(): Items<T> {
        const { items, search } = this.state;
        if (!search) {
            return items;
        }

        const filteredItems: Items<T> = {};

        for (const id of Object.keys(items)) {
            const item = items[id];
            if (matches(id, search) || matches(item.name, search)) {
                filteredItems[id] = item;
            }
        }

        return filteredItems;
    }

    private save = () => {
        this.setState({ modified: false });
        fs.writeFileSync(this.props.fileName, JSON.stringify(this.state.items, null, 2));
    };

    private rename = (id: string, newId: string) => {
        if (this.state.items[newId]) {
            alert('Already exists!');
            return;
        }

        const items: Items<T> = {};
        for (const key of Object.keys(this.state.items)) {
            items[key === id ? newId : key] = this.state.items[key];
        }
        this.setState({
            items,
            modified: true,
        });
    };

    private copy = (id: string, newId: string) => {
        if (this.state.items[newId]) {
            alert('Already exists!');
            return;
        }

        this.setState({
            items: {
                ...this.state.items,
                [newId]: this.state.items[id],
            },
            modified: true,
        });
    };

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

    private remove = (id: string) => {
        const items = {
            ...this.state.items,
        };
        delete items[id];
        const { selected } = this.state;
        this.setState({
            items,
            selected: selected === id ? null : selected,
            modified: true,
        });
    };

    private select = (id: string) => {
        this.setState({ selected: id });
    };

    private changeSearch = (e: React.SyntheticEvent<HTMLInputElement>) => {
        this.setState({ search: e.currentTarget.value });
    }

}

function matches(text: string, filter: string) {
    return text.toLocaleLowerCase().indexOf(filter.toLocaleLowerCase()) !== -1;
}

function numberOrStringSorter(a: string, b: string): number {
    const aNum = +a;
    const bNum = +b;
    if (aNum && bNum) {
        if (aNum < bNum)
            return -1;
        if (aNum > bNum)
            return 1;
        return 0;

    }
    return a.localeCompare(b);
}
