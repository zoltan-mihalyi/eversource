import * as React from 'react';

interface Props {
    values: string[];
    value: string;
    allowEmpty: boolean;
    onChange: (value: string) => void;
}

export class SimpleSelect extends React.Component<Props> {
    render() {
        const { values, value, allowEmpty } = this.props;
        const displayValues = allowEmpty ? ['', ...values] : values;
        return (
            <select value={value} onChange={this.onChange}>
                {(displayValues).map((value) => (
                    <option key={value} value={value}>{value}</option>
                ))}
            </select>
        );
    }

    private onChange = (e: React.SyntheticEvent<HTMLSelectElement>) => {
        this.props.onChange(e.currentTarget.value)
    };
}