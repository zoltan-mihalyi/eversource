import { EditComponent, EditProps } from './Edit';
import * as React from 'react';

interface OptionalEditProps<T, U> extends EditProps<T | U> {
    defaultElement: T;
    Edit: EditComponent<T>;
    empty: U;
}

class OptionalEdit<T, U> extends React.PureComponent<OptionalEditProps<T, U>> {
    render() {
        const { Edit, empty, value, onChange } = this.props;

        return (
            <div style={{ flexGrow: 1 }}>
                <input type="checkbox" checked={value !== empty} onChange={this.changeCheck}/>
                {value !== empty && (
                    <div>
                        <Edit value={value as T} onChange={onChange}/>
                    </div>
                )}
            </div>
        );
    }

    private changeCheck = (e: React.SyntheticEvent<HTMLInputElement>) => {
        const { onChange, defaultElement, empty } = this.props;

        onChange(e.currentTarget.checked ? defaultElement : empty);
    }
}

export function optionalEdit<T, U>(defaultElement: T, Edit: EditComponent<T>, empty: U): EditComponent<T | U> {
    return ({ value, onChange }) => {
        return (
            <OptionalEdit defaultElement={defaultElement} Edit={Edit} empty={empty} value={value} onChange={onChange}/>
        );
    };
}
