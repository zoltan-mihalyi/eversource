import * as React from 'react';
import { EditProps } from './edit/Edit';

interface Props<T> {
    name: string;
    originalItem: T;
    save: (item: T) => void;
    exit: () => void;
    EditComponent: React.ComponentType<EditProps<T>>;
}

interface State<T> {
    item: T;
}

export class ItemEdit<T> extends React.PureComponent<Props<T>, State<T>> {
    constructor(props: Props<T>) {
        super(props);
        this.state = {
            item: props.originalItem,
        };
    }

    render() {
        const { EditComponent } = this.props;

        return (
            <div>
                <button className="big" onClick={this.save}>Save</button>
                <button className="big" onClick={this.props.exit}>Exit</button>
                <h1 className="character-name">{this.props.name}</h1>
                <div>
                    <EditComponent value={this.state.item} onChange={this.onChange}/>
                </div>
            </div>
        );
    }

    private onChange = (item: T) => {
        this.setState({ item });
    };

    private save = () => {
        this.props.save(this.state.item);
    };
}
