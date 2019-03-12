import * as React from 'react';
import { SimpleSelect } from './SimpleSelect';

type Properties<T> = {
    [P in keyof T]: [string, string] | [string] | [] | string;
};

interface Props<T> {
    data: T;
    values: { [P in keyof T]: string[] };
    forceSelect: (keyof T)[];
    forceSelect2?: (keyof T)[];
    readExtraValues: (key: keyof T, value: string) => string[];
    onChange: (data: T) => void;
}

interface State<T> {
    extraValues: { [P in keyof T]: string[] };
}

export class PropTable<T extends Properties<T>> extends React.Component<Props<T>, State<T>> {
    constructor(props: Props<T>) {
        super(props);

        const extraValues = {} as State<T>['extraValues'];
        for (const key of Object.keys(props.values) as (keyof T)[]) {
            const value = props.data[key];

            if (Array.isArray(value)) {
                extraValues[key] = props.readExtraValues(key, value[0]);
            }
        }

        this.state = {
            extraValues,
        };
    }

    render() {
        const { values } = this.props;

        return (
            <table className="prop-table">
                <tbody>
                {(Object.keys(values) as (keyof T)[]).map((key) => (
                    <tr key={key as string}>
                        <td className="prop-name">{key}</td>
                        <td className="prop-value">
                            {this.renderPropValue(key)}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        );
    }

    private renderPropValue(key: keyof T) {
        const { data, values, forceSelect, forceSelect2, readExtraValues } = this.props;
        const { extraValues } = this.state;

        const valuesForKey = values[key];
        const propValue = data[key];
        if (typeof propValue === 'string') {
            return <SimpleSelect values={valuesForKey} value={propValue} allowEmpty={false}
                                 onChange={val => this.setValue(key, val)}/>
        }


        return (
            <>
                <SimpleSelect allowEmpty={forceSelect.indexOf(key) === -1} values={values[key]}
                              value={propValue[0]} onChange={v => {
                    const extraValues = readExtraValues(key, v);
                    this.setState({
                        extraValues: {
                            ...this.state.extraValues as any,
                            [key]: extraValues,
                        },
                    });
                    if (forceSelect2 && forceSelect2.indexOf(key) !== -1) {
                        this.setValue(key, [v, extraValues[0]])
                    } else {
                        this.setValue(key, v === '' ? [] : [v])
                    }
                }}/>

                <SimpleSelect values={extraValues[key] || []} value={propValue[1]}
                              allowEmpty={forceSelect2 !== void 0 && forceSelect2.indexOf(key) === -1}
                              onChange={v => {
                                  const primary = data[key][0];
                                  this.setValue(key, v === '' ? [primary] : [primary, v])
                              }}/>
            </>
        );
    }

    private setValue = <K extends keyof T>(key: K, value: T[K]) => {
        const { data, onChange } = this.props;

        onChange({
            ...data as any,
            [key]: value,
        });
    };
}
