import * as React from 'react';

interface Props {
    id: string;
    name: string;
    copy: (id: string, newId: string) => void
    rename: (id: string, newId: string) => void
    remove: (id: string) => void
    select: (id: string) => void
}

export class ListEditRow extends React.PureComponent<Props> {
    render() {
        const { id, name } = this.props;

        return (
            <tr>
                <td>
                    <button onClick={this.rename}>Rename</button>
                    <button onClick={this.copy}>Copy</button>
                    <button onClick={this.remove}>X</button>
                    <a href="#" onClick={this.select}>{id}</a>
                </td>
                <td>{name}</td>
            </tr>
        );
    }

    private rename = () => {
        const { id, rename } = this.props;

        const newId = prompt('New id', id);
        if (id === newId || !newId) {
            return;
        }

        rename(id, newId);
    };

    private copy = () => {
        const { id, copy } = this.props;

        const newId = prompt('New id', id);
        if (id === newId || !newId) {
            return;
        }

        copy(id, newId);
    };

    private remove = () => {
        const { id, remove } = this.props;
        if (!confirm(`Delete ${id}?`)) {
            return;
        }
        remove(id)
    };

    private select = () => {
        const { id, select } = this.props;
        select(id)
    };
}
