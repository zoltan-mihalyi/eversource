import * as React from 'react';
import { EditComponent, EditProps } from './Edit';

interface Props<T extends string> extends EditProps<T> {
    options: T[];
}

export class OptionEdit<T extends string> extends React.PureComponent<Props<T>> {
    render() {
        const { options, value } = this.props;

        return (
            <select value={value} onChange={this.change}>
                {options.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
        );
    }

    private change = (e: React.SyntheticEvent<HTMLSelectElement>) => {
        this.props.onChange(e.currentTarget.value as T);
    }
}

export function optionEdit<T extends string>(options: T[]): EditComponent<T> {
    return ({ value, onChange }) => (
        <OptionEdit options={options} value={value} onChange={onChange}/>
    );
}
