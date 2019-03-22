import { EditComponent, EditProps } from './Edit';
import * as React from 'react';

interface CacheItem<T> {
    values: T[];
    labels: string[];
    count: number;
}

const GET_VALUE_CACHE = new Map<() => any[], CacheItem<any>>();

export interface Labeled<T> {
    value: T;
    label: string;
}

interface Props<T> extends EditProps<T> {
    getValues: () => Labeled<T>[];
}

class IdEdit<T> extends React.PureComponent<Props<T>> {
    private cacheItem: CacheItem<T>;

    constructor(props: Props<T>) {
        super(props);

        let cacheItem = GET_VALUE_CACHE.get(props.getValues);
        if (!cacheItem) {
            const labeledValues = props.getValues();
            cacheItem = {
                count: 0,
                values: labeledValues.map(lv => lv.value),
                labels: labeledValues.map(lv => lv.label),
            };
        }
        this.cacheItem = cacheItem;
    }

    componentDidMount() {
        this.cacheItem.count++;
    }

    componentWillUnmount() {
        this.cacheItem.count--;

        if (this.cacheItem.count === 0) {
            GET_VALUE_CACHE.delete(this.props.getValues);
        }
    }

    render() {
        return (
            <select value={this.cacheItem.values.indexOf(this.props.value)} onChange={this.onChange}>
                {this.cacheItem.labels.map((label, i) => (
                    <option key={i} value={i}>{label}</option>
                ))}
            </select>
        );
    }

    private onChange = (e: React.SyntheticEvent<HTMLSelectElement>) => {
        this.props.onChange(this.cacheItem.values[+e.currentTarget.value]);
    }
}

export function idEdit<T>(getValues: () => Labeled<T>[]): EditComponent<T> {
    return ({ value, onChange }) => (
        <IdEdit value={value} onChange={onChange} getValues={getValues}/>
    );
}