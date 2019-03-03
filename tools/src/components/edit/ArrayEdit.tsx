import * as React from 'react';
import { EditComponent } from './Edit';

interface ArrayElementEditProps<T> {
    array: T[];
    index: number;
    ElementEdit: EditComponent<T>;
    onChange: (array: T[]) => void;
}

class ArrayElementEdit<T> extends React.PureComponent<ArrayElementEditProps<T>> {
    render() {
        const { array, index, ElementEdit } = this.props;

        return (
            <div style={{ display: 'flex', marginBottom: 20, marginLeft: 5, marginRight: 5, border: '2px solid black' }}>
                <div>
                    {index > 0 && (
                        <div>
                            <button onClick={this.moveUp}>^</button>
                        </div>
                    )}
                    <button onClick={this.onRemove}>X</button>
                    {index < array.length - 1 && (
                        <div>
                            <button onClick={this.moveDown}>v</button>
                        </div>
                    )}
                </div>
                <ElementEdit value={array[index]} onChange={this.onChange}/>
            </div>

        );
    }

    private swap(firstIndex: number) {
        const { array, onChange } = this.props;
        const newArray = [...array];

        const nextIndex = firstIndex + 1;

        const firstElement = newArray[firstIndex];
        newArray[firstIndex] = newArray[nextIndex];
        newArray[nextIndex] = firstElement;

        onChange(newArray);
    }

    private moveUp = () => {
        this.swap(this.props.index - 1);
    };
    private moveDown = () => {
        this.swap(this.props.index);
    };

    private onRemove = () => {
        const { array, index } = this.props;

        const newArray = [...array];
        newArray.splice(index, 1);

        this.props.onChange(newArray);

    };

    private onChange = (element: T) => {
        const { array, index } = this.props;

        const newArray = [...array];
        newArray[index] = element;

        this.props.onChange(newArray);
    }
}

interface ArrayEditProps<T> {
    array: T[];
    onChange: (elements: T[]) => void;
    defaultElement: T;
    ElementEdit: EditComponent<T>;
}

class ArrayEdit<T> extends React.PureComponent<ArrayEditProps<T>> {
    render() {
        const { array, onChange, ElementEdit } = this.props;

        return (
            <div style={{}}>
                {array.map((element, i) => <ArrayElementEdit key={i} array={array} index={i} ElementEdit={ElementEdit}
                                                             onChange={onChange}/>)}
                <div>
                    <button onClick={this.addElement} className="big">+</button>
                </div>
            </div>
        );
    }

    private addElement = () => {
        const { array, onChange, defaultElement } = this.props;

        onChange([...array, defaultElement]);
    };
}

export function arrayEdit<T>(defaultElement: T, ElementEdit: EditComponent<T>): EditComponent<T[]> {
    return ({ value, onChange }) => (
        <ArrayEdit array={value} onChange={onChange} defaultElement={defaultElement} ElementEdit={ElementEdit}/>
    );
}
